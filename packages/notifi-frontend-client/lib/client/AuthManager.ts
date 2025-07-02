import { NotifiService, Types } from '@notifi-network/notifi-graphql';

import {
  AuthParams,
  NotifiFrontendConfiguration,
  checkIsConfigWithDelegate,
  checkIsConfigWithPublicKey,
  checkIsConfigWithPublicKeyAndAddress,
} from '../configuration';
import {
  APTOS_BLOCKCHAINS,
  AptosBlockchain,
  BtcBlockchain,
  COSMOS_BLOCKCHAINS,
  CosmosBlockchain,
  EVM_BLOCKCHAINS,
  EvmBlockchain,
  SOLANA_BLOCKCHAINS,
  SolanaBlockchain,
  UnmaintainedBlockchain,
  isAptosBlockchain,
  isCosmosBlockchain,
  isEvmBlockchain,
  isSolanaBlockchain,
  isUsingAptosBlockchain,
  isUsingBtcBlockchain,
  isUsingCosmosBlockchain,
  isUsingEvmBlockchain,
  isUsingSolanaBlockchain,
  isUsingUnmaintainedBlockchain,
} from '../models';
import { Authorization, NotifiStorage, Roles } from '../storage';
import { normalizeHexString, notNullOrEmpty } from '../utils';

export class AuthManager {
  private _userState: UserState | null = null;
  private _clientRandomUuid: string | null = null; // Used for login via transaction
  constructor(
    private readonly _service: NotifiService,
    private readonly _storage: NotifiStorage,
    private readonly _configuration: NotifiFrontendConfiguration,
  ) {}

  get userState(): UserState | null {
    return this._userState;
  }

  async initialize(): Promise<UserState> {
    const [storedAuthorization, roles] = await Promise.all([
      this._storage.getAuthorization(),
      this._storage.getRoles(),
    ]);

    let authorization = storedAuthorization;
    if (authorization === null) {
      this._service.setJwt(undefined);
      const logOutStatus: UserState = {
        status: 'loggedOut',
      };
      this._userState = logOutStatus;
      return logOutStatus;
    }

    const expiryDate = new Date(authorization.expiry);
    const now = new Date();
    if (expiryDate <= now) {
      this._service.setJwt(undefined);
      const expiredStatus: UserState = {
        status: 'expired',
        authorization,
      };
      this._userState = expiredStatus;
      return expiredStatus;
    }

    const refreshTime = new Date();
    refreshTime.setDate(now.getDate() + 7);
    if (expiryDate < refreshTime) {
      try {
        const refreshMutation = await this._service.refreshAuthorization({});
        const newAuthorization = refreshMutation.refreshAuthorization;
        if (newAuthorization !== undefined) {
          this._storage.setAuthorization(newAuthorization);
          authorization = newAuthorization;
        }
      } catch (e: unknown) {
        console.error('Failed to refresh Notifi token:', e);
        return await this.logOut();
      }
    }

    this._service.setJwt(authorization.token);
    const userState: UserState = {
      status: 'authenticated',
      authorization,
      roles: roles ?? [],
    };
    this._userState = userState;
    return userState;
  }

  async logOut(): Promise<UserState> {
    await Promise.all([
      this._storage.setAuthorization(null),
      this._storage.setRoles(null),
      this._service.logOut(),
    ]);
    this._service.setJwt(undefined);
    const logOutStatus: UserState = {
      status: 'loggedOut',
    };
    this._userState = logOutStatus;
    return logOutStatus;
  }

  async logIn(loginParams: LoginParams): Promise<Types.UserFragmentFragment> {
    const timestamp = Math.round(Date.now() / 1000);
    const { tenantId, walletBlockchain } = this._configuration;

    let user: Types.UserFragmentFragment | undefined = undefined;
    if (isLoginWeb3Params(loginParams)) {
      user = await this._logInWithWeb3(loginParams);
    } else if (walletBlockchain === 'OFF_CHAIN') {
      const authentication = await this._authenticate({
        signMessageParams: loginParams,
        timestamp,
      });

      if (!('oidcProvider' in authentication)) {
        throw new Error('logIn - Invalid signature - expected OidcCredentials');
      }

      // 3rd party OIDC login
      const { oidcProvider, jwt } = authentication;
      const result = await this._service.logInByOidc({
        dappId: tenantId,
        oidcProvider,
        idToken: jwt,
      });
      user = result.logInByOidc.user;
    } else {
      // Legacy login flow
      const authentication = await this._authenticate({
        signMessageParams: loginParams,
        timestamp,
      });

      if (
        !('signature' in authentication) ||
        typeof authentication.signature !== 'string'
      ) {
        throw new Error(
          'logIn - Invalid signature - expected string signature and signedMessage',
        );
      }

      switch (walletBlockchain) {
        case 'SUI':
        case 'NEAR':
        case 'ARCH':
        case 'INJECTIVE':
        case 'BITCOIN': {
          const result = await this._service.logInFromDapp({
            walletBlockchain,
            walletPublicKey: this._configuration.walletPublicKey,
            accountId: this._configuration.accountAddress,
            dappAddress: tenantId,
            timestamp,
            signature: authentication.signature,
          });
          user = result.logInFromDapp;
          break;
        }
        default: {
          throw new Error(`Unsupported wallet blockchain: ${walletBlockchain}`);
        }
      }
    }

    if (user === undefined) {
      return Promise.reject('Failed to login');
    }

    await this._handleLogInResult(user);
    return user;
  }

  async beginLoginViaTransaction({
    walletBlockchain,
    walletAddress,
  }: BeginLoginProps): Promise<Types.BeginLogInByTransactionResult> {
    const { tenantId } = this._configuration;

    const result = await this._service.beginLogInByTransaction({
      walletAddress: walletAddress,
      walletBlockchain: walletBlockchain,
      dappAddress: tenantId,
    });

    const nonce = result.beginLogInByTransaction.nonce;

    if (nonce === null) {
      throw new Error('Failed to begin login process');
    }

    const ruuid = crypto.randomUUID();
    this._clientRandomUuid = ruuid;
    const encoder = new TextEncoder();
    const data = encoder.encode(nonce + ruuid);

    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    let prefix = '0x';
    // ⬇ Legacy purpose and will be deprecated after SDK V2. the prefix format will be aligned across all blockchains.
    if (walletBlockchain === 'SOLANA' || walletBlockchain === 'OSMOSIS') {
      prefix = 'Notifi Auth: 0x';
    }

    const logValue =
      prefix + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return { nonce: logValue };
  }

  async completeLoginViaTransaction({
    walletBlockchain,
    walletAddress,
    transactionSignature,
  }: CompleteLoginProps): Promise<Types.CompleteLogInByTransactionMutation> {
    const { tenantId } = this._configuration;
    const clientRandomUuid = this._clientRandomUuid;

    this._clientRandomUuid = null;

    if (clientRandomUuid === null) {
      throw new Error(
        'BeginLoginViaTransaction is required to be called first',
      );
    }

    const result = await this._service.completeLogInByTransaction({
      walletAddress: walletAddress,
      walletBlockchain: walletBlockchain,
      dappAddress: tenantId,
      randomUuid: clientRandomUuid,
      transactionSignature,
    });

    await this._handleLogInResult(result.completeLogInByTransaction);

    return result;
  }

  private async _logInWithWeb3(
    loginWeb3Params: LoginWeb3Params,
  ): Promise<Types.UserFragmentFragment | undefined> {
    if (
      !CHAINS_WITH_LOGIN_WEB3.includes(loginWeb3Params.walletBlockchain) ||
      loginWeb3Params.walletBlockchain !== loginWeb3Params.walletBlockchain
    ) {
      throw new Error(
        `Wallet blockchain must be one of ${CHAINS_WITH_LOGIN_WEB3.join(', ')} for loginWithWeb3`,
      );
    }

    const { nonce, signingAddress, signingPubkey, signMessageParams } =
      await this._prepareLoginWithWeb3(loginWeb3Params);

    const authentication = await this._authenticate({
      signMessageParams,
      timestamp: Math.round(Date.now() / 1000),
    });

    if (!('signature' in authentication) || !authentication.signature) {
      throw new Error(
        'Web3loginAuth - Signature required. Please sign the transaction to confirm your notifications.',
      );
    }
    const { completeLogInWithWeb3 } = await this._service.completeLogInWithWeb3(
      {
        nonce,
        signature: authentication.signature,
        signedMessage: authentication.signedMessage,
        signingAddress,
        signingPubkey: '', // TODO: why?
      },
    );
    //This is to ensure that hardware wallet logins are given authentication.
    //TODO: This is used for Solana Hardware Wallet Sign. May change in future for various HW wallet signs.
    await this._handleLogInResult(completeLogInWithWeb3.user);

    return completeLogInWithWeb3.user;
  }

  private async _authenticate({
    signMessageParams,
    timestamp,
  }: Readonly<{
    signMessageParams: SignMessageParams;
    timestamp: number;
  }>): Promise<AuthenticateResult> {
    if (
      this._configuration.walletBlockchain !==
      signMessageParams.walletBlockchain
    ) {
      throw new Error(
        'Sign message params and configuration must have the same blockchain',
      );
    }

    if (isUsingUnmaintainedBlockchain(signMessageParams)) {
      // Happens for chains that we discontinued support for
      // e.g. Acala, EVMOS
      throw new Error(
        `Unsupported blockchain: ${signMessageParams.walletBlockchain}. Please contact us if you believe this is an error or if you need support for a new blockchain.`,
      );
    }

    if (isUsingCosmosBlockchain(signMessageParams)) {
      const { signatureBase64, signedMessage } =
        await signMessageParams.signMessage(signMessageParams.message);
      return { signature: signatureBase64, signedMessage };
    } else if (isUsingAptosBlockchain(signMessageParams)) {
      const { signatureHex, signedMessage } =
        await signMessageParams.signMessage(
          SIGNING_MESSAGE_WITHOUT_NONCE,
          signMessageParams.nonce,
        );
      return { signature: signatureHex, signedMessage };
    } else if (isUsingEvmBlockchain(signMessageParams)) {
      const signedMessage = `${SIGNING_MESSAGE}${signMessageParams.nonce}`;
      const messageBuffer = new TextEncoder().encode(signedMessage);
      const signedBuffer = await signMessageParams.signMessage(messageBuffer);
      const signature = normalizeHexString(
        Buffer.from(signedBuffer).toString('hex'),
      );
      return { signature, signedMessage };
    } else if (isUsingSolanaBlockchain(signMessageParams)) {
      const signedMessage = `${SIGNING_MESSAGE}${signMessageParams.nonce}`;
      const messageBuffer = new TextEncoder().encode(signedMessage);
      const { isUsingHardwareWallet, hardwareLoginPlugin } = signMessageParams;

      const signature =
        isUsingHardwareWallet && hardwareLoginPlugin
          ? await hardwareLoginPlugin.signTransaction(signMessageParams.nonce)
          : await signMessageParams.signMessage(messageBuffer);

      if (typeof signature === 'string') {
        /* CASE1: HardWare wallet (signTransaction) returns a string */
        return { signature, signedMessage };
      }

      /* CASE2: SignMessage (signArbitrary) - returns Uint8Array */
      const stringifiedSignature = Buffer.from(signature).toString('base64');

      return { signature: stringifiedSignature, signedMessage };
    } else if (
      isUsingBtcBlockchain(signMessageParams) ||
      // ⬇ INJECTIVE becomes legacy: we should always separate BlockchainType if it supports both EVM & COSMOS. ex. 'INJ_EVM' & 'INJ'
      signMessageParams.walletBlockchain === 'INJECTIVE'
    ) {
      //TODO: Implement
      const { walletPublicKey, tenantId } = this._configuration as Extract<
        NotifiFrontendConfiguration,
        Extract<AuthParams, { accountAddress: string }>
      >;
      const signedMessage = `${SIGNING_MESSAGE}${walletPublicKey}${tenantId}${timestamp.toString()}`;
      const messageBuffer = new TextEncoder().encode(signedMessage);
      const signedBuffer = await signMessageParams.signMessage(messageBuffer);
      const signature = Buffer.from(signedBuffer).toString('base64');
      return { signature, signedMessage };
    }

    // Can only be the lonely chains now, e.g. Sui, NEAR ...
    switch (signMessageParams.walletBlockchain) {
      case 'SUI': {
        const { accountAddress, tenantId } = this._configuration as Extract<
          NotifiFrontendConfiguration,
          Extract<AuthParams, { accountAddress: string }>
        >;
        const signedMessage = `${SIGNING_MESSAGE}${accountAddress}${tenantId}${timestamp.toString()}`;
        const messageBuffer = new TextEncoder().encode(signedMessage);
        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = signedBuffer.toString();
        return { signature, signedMessage };
      }
      case 'NEAR': {
        const { walletPublicKey, accountAddress, tenantId } = this
          ._configuration as Extract<
          NotifiFrontendConfiguration,
          Extract<AuthParams, { accountAddress: string }>
        >;

        const message = `${
          `ed25519:` + walletPublicKey
        }${tenantId}${accountAddress}${timestamp.toString()}`;
        const textAsBuffer = new TextEncoder().encode(message);
        const hashBuffer = await window.crypto.subtle.digest(
          'SHA-256',
          textAsBuffer,
        );
        const messageBuffer = new Uint8Array(hashBuffer);

        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = Buffer.from(signedBuffer).toString('base64');
        return { signature, signedMessage: message };
      }
      case 'OFF_CHAIN': {
        const oidcCredentials = await signMessageParams.signIn();
        if (!oidcCredentials) {
          throw new Error('._authenticate: OIDC login failed');
        }
        return oidcCredentials;
      }
    }
  }

  private async _prepareLoginWithWeb3(
    signMessageParams: LoginWeb3Params,
  ): Promise<{
    signMessageParams: SignMessageParams;
    signingAddress: string;
    signingPubkey: string;
    nonce: string;
  }> {
    if (isCosmosBlockchain(signMessageParams.walletBlockchain)) {
      // Narrow the type of signMessage for XION
      const cosmosSignMessage =
        signMessageParams.signMessage as CosmosSignMessageFunction;

      if (checkIsConfigWithDelegate(this._configuration)) {
        const { delegatedAddress, delegatedPublicKey, delegatorAddress } =
          this._configuration;
        const { nonce } = await this._beginLogInWithWeb3({
          authAddress: delegatorAddress,
          authType: 'COSMOS_AUTHZ_GRANT',
        });

        const signedMessage = `${SIGNING_MESSAGE}${nonce}`;
        return {
          signMessageParams: {
            walletBlockchain: signMessageParams.walletBlockchain,
            message: signedMessage,
            signMessage: cosmosSignMessage,
          },
          signingAddress: delegatedAddress,
          signingPubkey: delegatedPublicKey,
          nonce,
        };
      } else if (checkIsConfigWithPublicKeyAndAddress(this._configuration)) {
        const { walletPublicKey, accountAddress } = this._configuration;
        const { nonce } = await this._beginLogInWithWeb3({
          authAddress: accountAddress,
          authType: 'COSMOS_ADR36',
        });
        const signedMessage = `${SIGNING_MESSAGE}${nonce}`;
        return {
          signMessageParams: {
            walletBlockchain: signMessageParams.walletBlockchain,
            message: signedMessage,
            signMessage: cosmosSignMessage,
          },
          signingAddress: accountAddress,
          signingPubkey: walletPublicKey,
          nonce,
        };
      }
    } else if (isAptosBlockchain(signMessageParams.walletBlockchain)) {
      // Narrow the type of signMessage for APTOS/MOVEMENT
      const aptosSignMessage =
        signMessageParams.signMessage as AptosSignMessageFunction;

      if (checkIsConfigWithPublicKeyAndAddress(this._configuration)) {
        const { nonce } = await this._beginLogInWithWeb3({
          authAddress: this._configuration.accountAddress,
          authType: 'APTOS_SIGNED_MESSAGE',
          walletPubkey: this._configuration.walletPublicKey,
        });

        return {
          signMessageParams: {
            walletBlockchain: signMessageParams.walletBlockchain,
            nonce,
            signMessage: aptosSignMessage,
          },
          signingAddress: this._configuration.accountAddress,
          signingPubkey: this._configuration.walletPublicKey,
          nonce,
        };
      }
    } else if (isSolanaBlockchain(signMessageParams.walletBlockchain)) {
      if (checkIsConfigWithPublicKey(this._configuration)) {
        const { isUsingHardwareWallet, hardwareLoginPlugin } =
          signMessageParams as SolanaSignMessageParams;
        const { nonce } =
          isUsingHardwareWallet && hardwareLoginPlugin
            ? await this._beginLogInWithWeb3({
                walletPubkey: this._configuration.walletPublicKey,
                authType: 'SOLANA_HARDWARE_SIGN_MESSAGE',
                authAddress: this._configuration.walletPublicKey,
              })
            : await this._beginLogInWithWeb3({
                walletPubkey: this._configuration.walletPublicKey,
                authType: 'SOLANA_SIGN_MESSAGE',
                authAddress: this._configuration.walletPublicKey,
              });
        return {
          signMessageParams: {
            walletBlockchain: signMessageParams.walletBlockchain,
            nonce,
            isUsingHardwareWallet,
            hardwareLoginPlugin,
            signMessage:
              signMessageParams.signMessage as Uint8SignMessageFunction,
          },
          signingAddress: this._configuration.walletPublicKey,
          signingPubkey: this._configuration.walletPublicKey,
          nonce,
        };
      }
    } else if (isEvmBlockchain(signMessageParams.walletBlockchain)) {
      if (checkIsConfigWithPublicKey(this._configuration)) {
        const { nonce } = await this._beginLogInWithWeb3({
          authAddress: this._configuration.walletPublicKey,
          authType: 'ETHEREUM_PERSONAL_SIGN',
        });
        return {
          signMessageParams: {
            walletBlockchain: signMessageParams.walletBlockchain,
            nonce,
            signMessage:
              signMessageParams.signMessage as Uint8SignMessageFunction,
          },
          signingAddress: this._configuration.walletPublicKey,
          signingPubkey: this._configuration.walletPublicKey,
          nonce,
        };
      }
    }
    throw new Error(
      `Invalid loginWeb3Params: ${JSON.stringify(signMessageParams)}`,
    );
  }

  private async _beginLogInWithWeb3({
    authType,
    authAddress,
    walletPubkey,
  }: BeginLoginWithWeb3Props): Promise<Types.BeginLogInWithWeb3Response> {
    const { tenantId } = this._configuration;
    const result = await this._service.beginLogInWithWeb3({
      dappAddress: tenantId,
      authAddress,
      blockchainType: this._configuration.walletBlockchain,
      authType,
      walletPubkey,
    });

    if (!result.beginLogInWithWeb3.beginLogInWithWeb3Response) {
      throw new Error('Failed to begin login process');
    }

    return result.beginLogInWithWeb3.beginLogInWithWeb3Response;
  }

  private async _handleLogInResult(
    user: Types.UserFragmentFragment | undefined,
  ): Promise<void> {
    const authorization = user?.authorization;
    const saveAuthorizationPromise =
      authorization !== undefined
        ? this._storage.setAuthorization(authorization)
        : Promise.resolve();

    const roles = user?.roles;
    const saveRolesPromise =
      roles !== undefined
        ? this._storage.setRoles(roles.filter(notNullOrEmpty))
        : Promise.resolve();

    if (authorization && roles) {
      const userState: UserState = {
        status: 'authenticated',
        authorization,
        roles: roles.filter((role): role is string => !!role),
      };
      this._userState = userState;
    }

    await Promise.all([saveAuthorizationPromise, saveRolesPromise]);
  }
}

type HexString = `0x${string}`;

/** NOTE:
 * 1. Used for frontend client `login` related methods - requires only authentication method(s) to be passed in (w/o UserParams)
 * 2. TODO: refactor to combine all Uint8SignMessageFunction to a single case.
 */

type CosmosSignMessageParams = Readonly<{
  walletBlockchain: CosmosBlockchain;
  message: string;
  signMessage: CosmosSignMessageFunction;
}>;

type AptosSignMessageParams = Readonly<{
  walletBlockchain: AptosBlockchain;
  nonce: string;
  signMessage: AptosSignMessageFunction;
}>;

// TODO: add message here when we migrate to loginwithweb3...
type BtcSignMessageParams = Readonly<{
  walletBlockchain: BtcBlockchain;
  signMessage: Uint8SignMessageFunction;
}>;

type EvmSignMessageParams = Readonly<{
  walletBlockchain: EvmBlockchain;
  nonce: string;
  signMessage: Uint8SignMessageFunction;
}>;

type SolanaSignMessageParams = Readonly<{
  walletBlockchain: SolanaBlockchain;
  nonce: string;
  signMessage: Uint8SignMessageFunction;
  isUsingHardwareWallet?: boolean;
  hardwareLoginPlugin?: {
    signTransaction: (message: string) => Promise<string>;
  };
}>;

type UnmaintainedSignMessageParams = Readonly<{
  walletBlockchain: UnmaintainedBlockchain;
  signMessage: Uint8SignMessageFunction;
}>;

export type SignMessageParams =
  | CosmosSignMessageParams
  | BtcSignMessageParams
  | EvmSignMessageParams
  | AptosSignMessageParams
  | SolanaSignMessageParams
  | UnmaintainedSignMessageParams
  | Readonly<{
      walletBlockchain: 'NEAR';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'SUI';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'OFF_CHAIN';
      signIn: OidcSignInFunction;
    }>
  | Readonly<{
      walletBlockchain: 'INJECTIVE';
      signMessage: Uint8SignMessageFunction;
    }>;

/** NOTE:
 * 1. Used for FrontendClientContext's props in `@notifi-network/notifi-react` - requires both authentication method(s) & UserParams to be passed in
 * 2. Naming might look confusing as it is a legacy naming to avoid breaking changes
 */

type SolanaWalletWithSignParams = Readonly<{
  signMessage: Uint8SignMessageFunction;
  isUsingHardwareWallet?: boolean;
  hardwareLoginPlugin?: {
    /**
     * @deprecated Use signTransaction() instead. We no longer have to send a txn, and instead simply rely on the signed TX as we can verify this on Notifi Services.
     */
    sendMessage?: (message: string) => Promise<string>;
    signTransaction: (message: string) => Promise<string>;
  };
}> &
  SolanaUserParams;

type AptosWalletWithSignParams = Readonly<{
  signMessage: AptosSignMessageFunction;
}> &
  AptosUserParams;

type BtcWalletWithSignParams = Readonly<{
  signMessage: Uint8SignMessageFunction;
}> &
  BtcUserParams;

type CosmosWalletWithSignParams = Readonly<{
  signMessage: CosmosSignMessageFunction;
}> &
  CosmosUserParams;

type EvmWalletWithSignParams = Readonly<{
  signMessage: Uint8SignMessageFunction;
}> &
  EvmUserParams;

type NearWalletWithSignParams = Readonly<{
  signMessage: Uint8SignMessageFunction;
}> &
  NearUserParams;

type SuiWalletWithSignParams = Readonly<{
  signMessage: Uint8SignMessageFunction;
}> &
  SuiUserParams;

type InjectiveWalletWithSignParams = Readonly<{
  signMessage: Uint8SignMessageFunction;
}> &
  InjectiveUserParams;

type OffChainWalletWithSignParams = Readonly<{
  signIn: OidcSignInFunction;
}> &
  OffChainUserParams;

type UnmaintainedWalletWithSignParams = Readonly<{
  signMessage: Uint8SignMessageFunction;
}> &
  UnmaintainedUserParams;

export type WalletWithSignParams =
  | SolanaWalletWithSignParams
  | AptosWalletWithSignParams
  | BtcWalletWithSignParams
  | EvmWalletWithSignParams
  | NearWalletWithSignParams
  | SuiWalletWithSignParams
  | OffChainWalletWithSignParams
  | CosmosWalletWithSignParams
  | InjectiveWalletWithSignParams
  | UnmaintainedWalletWithSignParams;

/** NOTE:
 * 1. Used for instantiating client object (.instantiateFrontendClient) - requires only UserParams (w/o authentication method(s)) to be passed in
 * 2. Naming might look confusing with `WalletWithSignParams`(which is a legacy naming to avoid breaking changes)
 */
export type UserParams =
  | SolanaUserParams
  | EvmUserParams
  | AptosUserParams
  | NearUserParams
  | SuiUserParams
  | CosmosUserParams
  | OffChainUserParams
  | UnmaintainedUserParams
  | BtcUserParams
  | InjectiveUserParams;
export type SolanaUserParams = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
}>;

export type AptosUserParams = Readonly<{
  walletBlockchain: AptosBlockchain;
  accountAddress: string;
  walletPublicKey: string;
}>;

export type BtcUserParams = Readonly<{
  walletBlockchain: BtcBlockchain;
  accountAddress: string;
  walletPublicKey: string;
}>;

export type EvmUserParams = Readonly<{
  walletBlockchain: EvmBlockchain;
  walletPublicKey: string;
}>;

export type InjectiveUserParams = Readonly<{
  walletBlockchain: 'INJECTIVE';
  accountAddress: string;
  walletPublicKey: string;
}>;

export type CosmosUserParams =
  | Readonly<{
      walletBlockchain: CosmosBlockchain;
      accountAddress: string;
      walletPublicKey: string;
    }>
  | Readonly<{
      walletBlockchain: CosmosBlockchain;
      walletPublicKey: string;
      signingAddress: string;
      signingPubkey: string;
    }>;

export type UnmaintainedUserParams = Readonly<{
  walletBlockchain: UnmaintainedBlockchain;
  accountAddress: string;
  walletPublicKey: string;
}>;

export type NearUserParams = Readonly<{
  walletBlockchain: 'NEAR';
  accountAddress: string;
  walletPublicKey: string;
}>;

export type SuiUserParams = Readonly<{
  walletBlockchain: 'SUI';
  accountAddress: string;
  walletPublicKey: string;
}>;

export type OffChainUserParams = Readonly<{
  walletBlockchain: 'OFF_CHAIN';
  userAccount: string;
}>;

export type ConnectWalletParams = Readonly<{
  walletParams: WalletWithSignParams;
  connectWalletConflictResolutionTechnique: Types.ConnectWalletInput['connectWalletConflictResolutionTechnique'];
}>;

export type Uint8SignMessageFunction = (
  message: Uint8Array,
) => Promise<Uint8Array>;

export type AptosSignMessageFunction = (
  message: string,
  nonce: string,
) => Promise<{
  signatureHex: HexString;
  signedMessage: string;
}>;

export type CosmosSignMessageFunction = (message: string) => Promise<{
  signatureBase64: string;
  signedMessage: string;
}>;

export type OidcCredentials = {
  oidcProvider: Types.OidcProvider;
  jwt: string;
};

export type OidcSignInFunction = () => Promise<OidcCredentials>;
export type SignMessageResult = { signature: string; signedMessage: string };

export type AuthenticateResult = SignMessageResult | OidcCredentials;

type BeginLoginProps = Omit<Types.BeginLogInByTransactionInput, 'dappAddress'>;

type BeginLoginWithWeb3Props = Omit<
  Types.BeginLogInWithWeb3Input,
  'dappAddress' | 'blockchainType'
>;

type CompleteLoginProps = Omit<
  Types.CompleteLogInByTransactionInput,
  'dappAddress' | 'randomUuid'
>;

// Don't split this line into multiple lines due to some packagers or other build modules that
// modify the string literal, which then causes authentication to fail due to different strings
const SIGNING_MESSAGE_WITHOUT_NONCE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy.`;
export const SIGNING_MESSAGE = `${SIGNING_MESSAGE_WITHOUT_NONCE} \n \n 'Nonce:' `;

const CHAINS_WITH_LOGIN_WEB3 = [
  ...APTOS_BLOCKCHAINS,
  ...COSMOS_BLOCKCHAINS,
  ...SOLANA_BLOCKCHAINS,
  ...EVM_BLOCKCHAINS,
] as const;

export type UserState = Readonly<
  | {
      status: 'loggedOut';
    }
  | {
      status: 'authenticated';
      authorization: Authorization;
      roles: Roles;
    }
  | {
      status: 'expired';
      authorization: Authorization;
    }
>;

type LoginWeb3Params = Omit<
  Extract<
    SignMessageParams,
    | { walletBlockchain: CosmosBlockchain }
    | { walletBlockchain: AptosBlockchain }
    | { walletBlockchain: SolanaBlockchain }
    | { walletBlockchain: EvmBlockchain }
  >,
  'message' | 'nonce'
>;

export type LoginParams =
  | Exclude<
      SignMessageParams,
      | { walletBlockchain: CosmosBlockchain }
      | { walletBlockchain: AptosBlockchain }
    >
  | LoginWeb3Params;

function isLoginWeb3Params(params: LoginParams): params is LoginWeb3Params {
  return CHAINS_WITH_LOGIN_WEB3.includes(
    params.walletBlockchain as (typeof CHAINS_WITH_LOGIN_WEB3)[number],
  );
}
