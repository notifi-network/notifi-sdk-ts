import { NotifiEmitterEvents, Types } from '@notifi-network/notifi-graphql';
import { NotifiService } from '@notifi-network/notifi-graphql';

import {
  type NotifiConfigWithPublicKey,
  type NotifiConfigWithPublicKeyAndAddress,
  type NotifiFrontendConfiguration,
  checkIsConfigWithDelegate,
  checkIsConfigWithPublicKeyAndAddress,
} from '../configuration';
import type {
  CardConfigItemV1,
  EventTypeItem,
  FusionEventTopic,
  TenantConfig,
  WalletBalanceEventTypeItem,
} from '../models';
import type { Authorization, NotifiStorage, Roles } from '../storage';
import {
  NotifiFrontendStorage,
  createInMemoryStorageDriver,
  createLocalForageStorageDriver,
} from '../storage';
import { notNullOrEmpty, packFilterOptions } from '../utils';
import { areIdsEqual } from '../utils/areIdsEqual';
import {
  AlterTargetGroupParams,
  alterTargetGroupImpl,
} from './alterTargetGroup';
import {
  APTOS_BLOCKCHAINS,
  AptosBlockchain,
  BtcBlockchain,
  COSMOS_BLOCKCHAINS,
  CosmosBlockchain,
  EvmBlockchain,
  UnmaintainedBlockchain,
  isAptosBlockchain,
  isCosmosBlockchain,
  isUsingAptosBlockchain,
  isUsingBtcBlockchain,
  isUsingCosmosBlockchain,
  isUsingEvmBlockchain,
  isUsingUnmaintainedBlockchain,
} from './blockchains';
import { ensureSourceAndFilters, normalizeHexString } from './ensureSource';
import {
  ensureDiscord,
  ensureEmail,
  ensureSlack,
  ensureSms,
  ensureTelegram,
  ensureWeb3,
  renewTelegram,
} from './ensureTarget';

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
  signMessage: Uint8SignMessageFunction;
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
  | UnmaintainedSignMessageParams
  | Readonly<{
      walletBlockchain: 'SOLANA';
      signMessage: Uint8SignMessageFunction;
    }>
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
  hardwareLoginPlugin?: {
    // NOTE: Solana specific: solana hardware wallet sign-in requires a memo contract verification
    sendMessage: (message: string) => Promise<string>;
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

export type CardConfigType = CardConfigItemV1;

type BeginLoginProps = Omit<Types.BeginLogInByTransactionInput, 'dappAddress'>;

type BeginLoginWithWeb3Props = Omit<
  Types.BeginLogInWithWeb3Input,
  'dappAddress' | 'blockchainType'
>;

type CompleteLoginProps = Omit<
  Types.CompleteLogInByTransactionInput,
  'dappAddress' | 'randomUuid'
>;

type CompleteLoginWithWeb3Props = Types.CompleteLogInWithWeb3Input;

type FindSubscriptionCardParams = Omit<Types.FindTenantConfigInput, 'tenant'>;

// Don't split this line into multiple lines due to some packagers or other build modules that
// modify the string literal, which then causes authentication to fail due to different strings
const SIGNING_MESSAGE_WITHOUT_NONCE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy.`;
export const SIGNING_MESSAGE = `${SIGNING_MESSAGE_WITHOUT_NONCE} \n \n 'Nonce:' `;

const CHAINS_WITH_LOGIN_WEB3 = [
  ...APTOS_BLOCKCHAINS,
  ...COSMOS_BLOCKCHAINS,
] as const;

export type SupportedCardConfigType = CardConfigItemV1;

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
  >,
  'message' | 'nonce'
>;

type LoginParams =
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

export class NotifiFrontendClient {
  constructor(
    private _configuration: NotifiFrontendConfiguration,
    private _service: NotifiService,
    private _storage: NotifiStorage,
  ) {}

  private _clientRandomUuid: string | null = null;
  private _userState: UserState | null = null;

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
        await this.logOut();
        console.error('Failed to refresh Notifi token:', e);
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

    return {
      status: 'loggedOut',
    };
  }

  private async prepareLoginWithWeb3(
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
        const { authenticationKey, accountAddress } = this._configuration;
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
          signingPubkey: authenticationKey,
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
          walletPubkey: this._configuration.authenticationKey,
        });

        return {
          signMessageParams: {
            walletBlockchain: signMessageParams.walletBlockchain,
            nonce,
            signMessage: aptosSignMessage,
          },
          signingAddress: this._configuration.accountAddress,
          signingPubkey: this._configuration.authenticationKey,
          nonce,
        };
      }
    }

    throw new Error(
      `Invalid loginWeb3Params: ${JSON.stringify(signMessageParams)}`,
    );
  }

  private async logInWithWeb3(
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
      await this.prepareLoginWithWeb3(loginWeb3Params);

    const authentication = await this._authenticate({
      signMessageParams,
      timestamp: Math.round(Date.now() / 1000),
    });

    if (!('signature' in authentication)) {
      throw new Error('logInWith Web3 - Invalid signature - expected string');
    }

    const { completeLogInWithWeb3 } = await this.completeLogInWithWeb3({
      nonce,
      signature: authentication.signature,
      signedMessage: authentication.signedMessage,
      signingAddress,
      signingPubkey,
    });

    return completeLogInWithWeb3.user;
  }

  async logIn(loginParams: LoginParams): Promise<Types.UserFragmentFragment> {
    const timestamp = Math.round(Date.now() / 1000);
    const { tenantId, walletBlockchain } = this._configuration;

    let user: Types.UserFragmentFragment | undefined = undefined;

    if (isLoginWeb3Params(loginParams)) {
      user = await this.logInWithWeb3(loginParams);
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
        case 'BLAST':
        case 'BERACHAIN':
        case 'CELO':
        case 'MANTLE':
        case 'LINEA':
        case 'SCROLL':
        case 'MANTA':
        case 'MONAD':
        case 'BASE':
        case 'THE_ROOT_NETWORK':
        case 'ETHEREUM':
        case 'POLYGON':
        case 'ARBITRUM':
        case 'AVALANCHE':
        case 'BINANCE':
        case 'OPTIMISM':
        case 'ZKSYNC':
        case 'SOLANA':
        case 'ROME':
        case 'SWELLCHAIN':
        case 'BOB':
        case 'SEI':

        case 'SONIC': {
          const result = await this._service.logInFromDapp({
            walletBlockchain,
            walletPublicKey: this._configuration.walletPublicKey,
            dappAddress: tenantId,
            timestamp,
            signature: authentication.signature,
          });
          user = result.logInFromDapp;
          break;
        }
        case 'SUI':
        case 'NEAR':
        case 'ARCH':
        case 'INJECTIVE':
        case 'BITCOIN': {
          const result = await this._service.logInFromDapp({
            walletBlockchain,
            walletPublicKey: this._configuration.authenticationKey,
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
        `Unsupported blockchain: ${signMessageParams.walletBlockchain}. Please contact us if you beleive this is an error or if you need support for a new blockchain.`,
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
      const { walletPublicKey, tenantId } = this
        ._configuration as NotifiConfigWithPublicKey;
      const signedMessage = `${SIGNING_MESSAGE}${walletPublicKey}${tenantId}${timestamp.toString()}`;
      const messageBuffer = new TextEncoder().encode(signedMessage);

      const signedBuffer = await signMessageParams.signMessage(messageBuffer);
      const signature = normalizeHexString(
        Buffer.from(signedBuffer).toString('hex'),
      );

      return { signature, signedMessage };
    } else if (
      isUsingBtcBlockchain(signMessageParams) ||
      signMessageParams.walletBlockchain === 'INJECTIVE'
    ) {
      //TODO: Implement
      const { authenticationKey, tenantId } = this
        ._configuration as NotifiConfigWithPublicKeyAndAddress;
      const signedMessage = `${SIGNING_MESSAGE}${authenticationKey}${tenantId}${timestamp.toString()}`;
      const messageBuffer = new TextEncoder().encode(signedMessage);
      const signedBuffer = await signMessageParams.signMessage(messageBuffer);
      const signature = Buffer.from(signedBuffer).toString('base64');
      return { signature, signedMessage };
    }

    // Can only be the lonely chains now, e.g. Solana, Sui, ...
    switch (signMessageParams.walletBlockchain) {
      case 'SOLANA': {
        const { walletPublicKey, tenantId } = this
          ._configuration as NotifiConfigWithPublicKey;
        const signedMessage = `${SIGNING_MESSAGE}${walletPublicKey}${tenantId}${timestamp.toString()}`;
        const messageBuffer = new TextEncoder().encode(signedMessage);

        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = Buffer.from(signedBuffer).toString('base64');
        return { signature, signedMessage };
      }
      case 'SUI': {
        const { accountAddress, tenantId } = this
          ._configuration as NotifiConfigWithPublicKeyAndAddress;
        const signedMessage = `${SIGNING_MESSAGE}${accountAddress}${tenantId}${timestamp.toString()}`;
        const messageBuffer = new TextEncoder().encode(signedMessage);
        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = signedBuffer.toString();
        return { signature, signedMessage };
      }
      case 'NEAR': {
        const { authenticationKey, accountAddress, tenantId } = this
          ._configuration as NotifiConfigWithPublicKeyAndAddress;

        const message = `${
          `ed25519:` + authenticationKey
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

  async fetchFusionData(): Promise<Types.FetchFusionDataQuery> {
    return this._service.fetchFusionData({});
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
    // TDOO: ⬇ Legacy purpose and will be deprecated after SDK V2. the prefix format will be aligned across all blockchains.
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

  async _beginLogInWithWeb3({
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

  async completeLogInWithWeb3(
    input: CompleteLoginWithWeb3Props,
  ): Promise<Types.CompleteLogInWithWeb3Mutation> {
    const result = await this._service.completeLogInWithWeb3({
      signingPubkey: '',
      ...input,
    });

    return result;
  }

  async getTargetGroups(): Promise<
    ReadonlyArray<Types.TargetGroupFragmentFragment>
  > {
    const query = await this._service.getTargetGroups({});
    const results = query.targetGroup?.filter(notNullOrEmpty) ?? [];
    return results;
  }

  async getAlerts(): Promise<ReadonlyArray<Types.AlertFragmentFragment>> {
    const query = await this._service.getAlerts({});
    return query.alert?.filter(notNullOrEmpty) ?? [];
  }

  async ensureFusionAlerts(
    input: Types.CreateFusionAlertsInput,
  ): Promise<Types.CreateFusionAlertsMutation['createFusionAlerts']> {
    const inputAlertsNames = new Set(input.alerts.map((alert) => alert.name));
    const query = await this._service.getAlerts({});
    const existingAlerts = new Set(query.alert);

    const duplicateAlerts = [...existingAlerts].filter((alert) =>
      inputAlertsNames.has(alert?.name),
    );

    const duplicateAlertsIds = duplicateAlerts
      .map((alert) => alert?.id)
      .filter((id): id is string => !!id); // TODO: n(^2) --> consider to move to BE when this grows huge

    /* Alerts are immutable, delete the existing instead */
    // TODO: refactor using deleteAlerts
    for (const id of duplicateAlertsIds) {
      await this.deleteAlert({ id });
    }

    const mutation = await this._service.createFusionAlerts({ input });
    return mutation.createFusionAlerts;
  }

  async deleteAlerts({
    ids,
  }: Readonly<{
    ids: Array<string>;
  }>): Promise<Types.DeleteAlertsMutation['deleteAlerts']> {
    const mutation = await this._service.deleteAlerts({
      input: { alertIds: ids },
    });
    const result = mutation.deleteAlerts;
    if (result === undefined) {
      throw new Error('Failed to delete alerts');
    }
    return result;
  }

  async updateWallets() {
    const walletEventTypeItem: WalletBalanceEventTypeItem = {
      name: 'User Wallets',
      type: 'walletBalance',
    };
    const result = await ensureSourceAndFilters(
      this._service,
      walletEventTypeItem,
      {},
    );
    return result;
  }

  async getUnreadNotificationHistoryCount(
    cardId?: string,
  ): Promise<
    Types.GetUnreadNotificationHistoryCountQuery['unreadNotificationHistoryCount']
  > {
    const query = await this._service.getUnreadNotificationHistoryCount({
      cardId,
    });
    const result = query.unreadNotificationHistoryCount;
    if (!result) {
      throw new Error('Failed to fetch unread notification history count');
    }
    return result;
  }

  /**
   * @returns {string} - The id of the event listener (used to remove the event listener)
   */
  addEventListener<K extends keyof NotifiEmitterEvents>(
    event: K,
    callBack: (...args: NotifiEmitterEvents[K]) => void,
    onError?: (error: unknown) => void,
    onCompleted?: () => void,
  ): string {
    return this._service.addEventListener(
      event,
      callBack,
      onError,
      onCompleted,
    );
  }

  removeEventListener<K extends keyof NotifiEmitterEvents>(
    event: K,
    id: string,
  ) {
    return this._service.removeEventListener(event, id);
  }

  async getUserSettings(): Promise<Types.GetUserSettingsQuery['userSettings']> {
    const query = await this._service.getUserSettings({});
    const result = query.userSettings;
    if (!result) {
      throw new Error('Failed to fetch user settings');
    }
    return result;
  }

  async getFusionNotificationHistory(
    variables: Types.GetFusionNotificationHistoryQueryVariables,
  ): Promise<
    Readonly<
      Types.GetFusionNotificationHistoryQuery['fusionNotificationHistory']
    >
  > {
    const query = await this._service.getFusionNotificationHistory(variables);
    const nodes = query.fusionNotificationHistory?.nodes;
    const pageInfo = query.fusionNotificationHistory?.pageInfo;
    if (nodes === undefined || pageInfo === undefined) {
      throw new Error('Failed to fetch notification history');
    }

    return { pageInfo, nodes };
  }

  async fetchTenantConfig(
    variables: FindSubscriptionCardParams,
  ): Promise<TenantConfig> {
    const query = await this._service.findTenantConfig({
      input: {
        ...variables,
        tenant: this._configuration.tenantId,
      },
    });
    const result = query.findTenantConfig;
    if (result === undefined || !result.dataJson || !result.fusionEvents) {
      throw new Error('Failed to find tenant config');
    }

    const tenantConfigJsonString = result.dataJson;
    if (tenantConfigJsonString === undefined) {
      throw new Error('Invalid config data');
    }

    const cardConfig = JSON.parse(tenantConfigJsonString) as CardConfigItemV1;
    const fusionEventDescriptors = result.fusionEvents;

    if (!cardConfig || cardConfig.version !== 'v1' || !fusionEventDescriptors)
      throw new Error('Unsupported config format');

    const fusionEventDescriptorMap = new Map<
      string,
      Types.FusionEventDescriptor
    >(fusionEventDescriptors.map((item) => [item?.name ?? '', item ?? {}]));

    fusionEventDescriptorMap.delete('');

    const fusionEventTopics: FusionEventTopic[] = cardConfig.eventTypes
      .map((eventType) => {
        if (eventType.type === 'fusion') {
          const fusionEventDescriptor = fusionEventDescriptorMap.get(
            eventType.name,
          );
          return {
            uiConfig: eventType,
            fusionEventDescriptor,
          };
        }
      })
      .filter((item): item is FusionEventTopic => !!item);

    return { cardConfig, fusionEventTopics };
  }

  async copyAuthorization(config: NotifiFrontendConfiguration) {
    const auth = await this._storage.getAuthorization();
    const roles = await this._storage.getRoles();

    const driver =
      config.storageOption?.driverType === 'InMemory'
        ? createInMemoryStorageDriver(config)
        : createLocalForageStorageDriver(config);
    const otherStorage = new NotifiFrontendStorage(driver);

    await Promise.all([
      otherStorage.setAuthorization(auth),
      otherStorage.setRoles(roles),
    ]);
  }
  async sendEmailTargetVerification({
    targetId,
  }: Readonly<{ targetId: string }>): Promise<string> {
    const emailTarget = await this._service.sendEmailTargetVerificationRequest({
      targetId,
    });

    const id = emailTarget.sendEmailTargetVerificationRequest?.id;
    if (id === undefined) {
      throw new Error(`Unknown error requesting verification`);
    }
    return id;
  }

  async createDiscordTarget(input: string) {
    const mutation = await this._service.createDiscordTarget({
      name: input,
      value: input,
    });
    return mutation.createDiscordTarget;
  }

  async markFusionNotificationHistoryAsRead(
    input: Types.MarkFusionNotificationHistoryAsReadMutationVariables,
  ): Promise<Types.MarkFusionNotificationHistoryAsReadMutation> {
    const mutation =
      await this._service.markFusionNotificationHistoryAsRead(input);
    return mutation;
  }
  async updateUserSettings(
    input: Types.UpdateUserSettingsMutationVariables,
  ): Promise<Types.UpdateUserSettingsMutation> {
    const mutation = await this._service.updateUserSettings(input);
    return mutation;
  }

  async verifyXmtpTarget(
    input: Types.VerifyXmtpTargetMutationVariables,
  ): Promise<Types.VerifyXmtpTargetMutation> {
    const mutation = await this._service.verifyXmtpTarget(input);
    return mutation;
  }

  async verifyCbwTarget(
    input: Types.VerifyCbwTargetMutationVariables,
  ): Promise<Types.VerifyCbwTargetMutation> {
    const mutation = await this._service.verifyCbwTarget(input);
    return mutation;
  }

  async verifyXmtpTargetViaXip42(
    input: Types.VerifyXmtpTargetViaXip42MutationVariables,
  ): Promise<Types.VerifyXmtpTargetViaXip42Mutation> {
    const mutation = await this._service.verifyXmtpTargetViaXip42(input);
    return mutation;
  }

  async createWebPushTarget(
    input: Types.CreateWebPushTargetMutationVariables,
  ): Promise<Types.CreateWebPushTargetMutation> {
    const mutation = await this._service.createWebPushTarget(input);
    return mutation;
  }

  async updateWebPushTarget(
    input: Types.UpdateWebPushTargetMutationVariables,
  ): Promise<Types.UpdateWebPushTargetMutation> {
    const mutation = await this._service.updateWebPushTarget(input);
    return mutation;
  }

  async deleteWebPushTarget(
    input: Types.DeleteWebPushTargetMutationVariables,
  ): Promise<Types.DeleteWebPushTargetMutation> {
    const mutation = await this._service.deleteWebPushTarget(input);
    return mutation;
  }

  async getWebPushTargets(
    input: Types.GetWebPushTargetsQueryVariables,
  ): Promise<Types.GetWebPushTargetsQuery['webPushTargets']> {
    const query = await this._service.getWebPushTargets(input);
    const result = query.webPushTargets;
    if (!result) {
      throw new Error('Failed to fetch webpush targets');
    }
    return result;
  }

  async alterTargetGroup(
    alterTargetGroupParams: AlterTargetGroupParams,
  ): Promise<Types.TargetGroupFragmentFragment> {
    return await alterTargetGroupImpl(alterTargetGroupParams, this._service);
  }

  /**
   * ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇
   * ⬇ ⬇ Deprecated methods ⬇ ⬇
   * ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇ ⬇
   */

  /** @deprecated only for legacy infrastructure */
  async getSourceGroups(): Promise<
    ReadonlyArray<Types.SourceGroupFragmentFragment>
  > {
    const query = await this._service.getSourceGroups({});
    const results = query.sourceGroup?.filter(notNullOrEmpty) ?? [];
    return results;
  }

  /**
   * @deprecated use the return type of addEventListener & removeEventListener instead.
   * @description never use this when having multiple gql subscription in the app. This case, dispose websocket could break other subscriptions.
   */
  async wsDispose() {
    this._service.wsDispose();
  }

  /**
   * @deprecated Use getFusionNotificationHistory instead
   */
  async getNotificationHistory(
    variables: Types.GetNotificationHistoryQueryVariables,
  ): Promise<
    Readonly<{
      pageInfo: Types.PageInfoFragmentFragment;
      nodes: ReadonlyArray<Types.NotificationHistoryEntryFragmentFragment>;
    }>
  > {
    const query = await this._service.getNotificationHistory(variables);
    const nodes = query.notificationHistory?.nodes;
    const pageInfo = query.notificationHistory?.pageInfo;
    if (nodes === undefined || pageInfo === undefined) {
      throw new Error('Failed to fetch notification history');
    }

    return { pageInfo, nodes };
  }

  /**
   * @deprecated use addEventListener instead.
   */
  subscribeNotificationHistoryStateChanged(
    onMessageReceived: (data: any) => void | undefined,
    onError?: (data: any) => void | undefined,
    onComplete?: () => void | undefined,
  ): ReturnType<NotifiService['subscribeNotificationHistoryStateChanged']> {
    return this._service.subscribeNotificationHistoryStateChanged(
      onMessageReceived,
      onError,
      onComplete,
    );
  }

  /** @deprecated legacy infrastructure, use ensureFusionAlerts instead */
  async ensureAlert({
    eventType,
    inputs,
    targetGroupName = 'Default',
  }: Readonly<{
    eventType: EventTypeItem;
    inputs: Record<string, unknown>;
    targetGroupName?: string;
  }>): Promise<Types.AlertFragmentFragment> {
    const [alertsQuery, targetGroupsQuery, sourceAndFilters] =
      await Promise.all([
        this._service.getAlerts({}),
        this._service.getTargetGroups({}),
        ensureSourceAndFilters(this._service, eventType, inputs),
      ]);

    const targetGroup = targetGroupsQuery.targetGroup?.find(
      (it) => it?.name === targetGroupName,
    );
    if (targetGroup === undefined) {
      throw new Error('Target group does not exist');
    }

    const { sourceGroup, filter, filterOptions } = sourceAndFilters;
    const packedOptions = packFilterOptions(filterOptions);

    const existing = alertsQuery.alert?.find(
      (it) => it !== undefined && it.name === eventType.name,
    );

    if (existing !== undefined) {
      if (
        existing.sourceGroup.id === sourceGroup.id &&
        existing.targetGroup.id === targetGroup.id &&
        existing.filter.id === filter.id &&
        existing.filterOptions === packedOptions
      ) {
        return existing;
      }

      // Alerts are immutable, delete the existing instead
      await this.deleteAlert({
        id: existing.id,
      });
    }

    const mutation = await this._service.createAlert({
      name: eventType.name,
      sourceGroupId: sourceGroup.id,
      filterId: filter.id,
      targetGroupId: targetGroup.id,
      filterOptions: packedOptions,
      groupName: 'managed',
    });

    const created = mutation.createAlert;
    if (created === undefined) {
      throw new Error('Failed to create alert');
    }

    return created;
  }

  /** @deprecated use fetchFusionData instead. This is for legacy  */
  async fetchData(): Promise<Types.FetchDataQuery> {
    return this._service.fetchData({});
  }

  /**@deprecated for legacy infra, use fetchTenantConfig instead for new infra (fusionEvent)  */
  async fetchSubscriptionCard(
    variables: FindSubscriptionCardParams,
  ): Promise<CardConfigType> {
    const query = await this._service.findTenantConfig({
      input: {
        ...variables,
        tenant: this._configuration.tenantId,
      },
    });
    const result = query.findTenantConfig;
    if (result === undefined) {
      throw new Error('Failed to find tenant config');
    }

    const value = result.dataJson;
    if (value === undefined) {
      throw new Error('Invalid config data');
    }

    const obj = JSON.parse(value);
    let card: CardConfigType | undefined = undefined;
    switch (obj.version) {
      case 'v1': {
        card = obj as CardConfigItemV1;
        break;
      }
      default: {
        throw new Error('Unsupported config version');
      }
    }

    if (card === undefined) {
      throw new Error('Unsupported config format');
    }

    return card;
  }

  /** @deprecated Use renewTargetGroup instead */
  async ensureTargetGroup({
    name,
    emailAddress,
    phoneNumber,
    telegramId,
    discordId,
    slackId,
    walletId,
  }: Readonly<{
    name: string;
    emailAddress?: string;
    phoneNumber?: string;
    telegramId?: string;
    discordId?: string;
    slackId?: string;
    walletId?: string;
  }>): Promise<Types.TargetGroupFragmentFragment> {
    const [
      targetGroupsQuery,
      emailTargetId,
      smsTargetId,
      telegramTargetId,
      discordTargetId,
      slackTargetId,
      web3TargetId,
    ] = await Promise.all([
      this._service.getTargetGroups({}),
      ensureEmail(this._service, emailAddress),
      ensureSms(this._service, phoneNumber),
      ensureTelegram(this._service, telegramId),
      ensureDiscord(this._service, discordId),
      ensureSlack(this._service, slackId),
      ensureWeb3(this._service, walletId),
    ]);

    const emailTargetIds = emailTargetId === undefined ? [] : [emailTargetId];
    const smsTargetIds = smsTargetId === undefined ? [] : [smsTargetId];
    const telegramTargetIds =
      telegramTargetId === undefined ? [] : [telegramTargetId];
    const discordTargetIds =
      discordTargetId === undefined ? [] : [discordTargetId];
    const slackChannelTargetIds =
      slackTargetId === undefined ? [] : [slackTargetId];
    const web3TargetIds = web3TargetId === undefined ? [] : [web3TargetId];

    const existing = targetGroupsQuery.targetGroup?.find(
      (it) => it?.name === name,
    );
    if (existing !== undefined) {
      return this._updateTargetGroup({
        existing,
        emailTargetIds,
        smsTargetIds,
        telegramTargetIds,
        discordTargetIds,
        slackChannelTargetIds,
        web3TargetIds,
      });
    }

    const createMutation = await this._service.createTargetGroup({
      name,
      emailTargetIds,
      smsTargetIds,
      telegramTargetIds,
      discordTargetIds,
      slackChannelTargetIds,
      web3TargetIds,
    });

    if (createMutation.createTargetGroup === undefined) {
      throw new Error('Failed to create target group');
    }

    return createMutation.createTargetGroup;
  }

  /**
   * @deprecated use alterTargetGroup instead
   * @description !IMPORTANT: the id arguments (telegramId, discordId, slackId, walletId) is the self-defined identity (only within notifi BE). This is NEITHER the user name NOR the user id of associated platform.
   */
  async renewTargetGroup({
    name,
    emailAddress,
    phoneNumber,
    telegramId,
    discordId,
    slackId,
    walletId,
  }: Readonly<{
    name: string;
    emailAddress?: string;
    phoneNumber?: string;
    telegramId?: string;
    discordId?: string;
    slackId?: string;
    walletId?: string;
  }>): Promise<Types.TargetGroupFragmentFragment> {
    const [
      targetGroupsQuery,
      emailTargetId,
      smsTargetId,
      telegramTargetId,
      discordTargetId,
      slackTargetId,
      web3TargetId,
    ] = await Promise.all([
      this._service.getTargetGroups({}),
      ensureEmail(this._service, emailAddress),
      ensureSms(this._service, phoneNumber),
      renewTelegram(this._service, telegramId),
      ensureDiscord(this._service, discordId),
      ensureSlack(this._service, slackId),
      ensureWeb3(this._service, walletId),
    ]);

    const emailTargetIds = emailTargetId === undefined ? [] : [emailTargetId];
    const smsTargetIds = smsTargetId === undefined ? [] : [smsTargetId];
    const telegramTargetIds =
      telegramTargetId === undefined ? [] : [telegramTargetId];
    const discordTargetIds =
      discordTargetId === undefined ? [] : [discordTargetId];
    const slackChannelTargetIds =
      slackTargetId === undefined ? [] : [slackTargetId];
    const web3TargetIds = web3TargetId === undefined ? [] : [web3TargetId];

    const existing = targetGroupsQuery.targetGroup?.find(
      (it) => it?.name === name,
    );
    if (existing !== undefined) {
      return this._updateTargetGroup({
        existing,
        emailTargetIds,
        smsTargetIds,
        telegramTargetIds,
        discordTargetIds,
        slackChannelTargetIds,
        web3TargetIds,
      });
    }

    const createMutation = await this._service.createTargetGroup({
      name,
      emailTargetIds,
      smsTargetIds,
      telegramTargetIds,
      discordTargetIds,
      slackChannelTargetIds,
      web3TargetIds,
    });

    if (createMutation.createTargetGroup === undefined) {
      throw new Error('Failed to create target group');
    }

    return createMutation.createTargetGroup;
  }
  /**
   * @deprecated all consumers (ensureTargetGroup) are deprecated
   */
  private async _updateTargetGroup({
    existing,
    emailTargetIds,
    smsTargetIds,
    telegramTargetIds,
    discordTargetIds,
    slackChannelTargetIds,
    web3TargetIds,
  }: Readonly<{
    existing: Types.TargetGroupFragmentFragment;
    emailTargetIds: Array<string>;
    smsTargetIds: Array<string>;
    telegramTargetIds: Array<string>;
    discordTargetIds: Array<string>;
    slackChannelTargetIds: Array<string>;
    web3TargetIds: Array<string>;
  }>): Promise<Types.TargetGroupFragmentFragment> {
    if (
      areIdsEqual(emailTargetIds, existing.emailTargets ?? []) &&
      areIdsEqual(smsTargetIds, existing.smsTargets ?? []) &&
      areIdsEqual(telegramTargetIds, existing.telegramTargets ?? []) &&
      areIdsEqual(discordTargetIds, existing.discordTargets ?? []) &&
      areIdsEqual(slackChannelTargetIds, existing.slackChannelTargets ?? []) &&
      areIdsEqual(web3TargetIds, existing.web3Targets ?? [])
    ) {
      return existing;
    }

    const updateMutation = await this._service.updateTargetGroup({
      id: existing.id,
      name: existing.name ?? existing.id,
      emailTargetIds,
      smsTargetIds,
      telegramTargetIds,
      discordTargetIds,
      slackChannelTargetIds,
      web3TargetIds,
    });

    const updated = updateMutation.updateTargetGroup;
    if (updated === undefined) {
      throw new Error('Failed to update target group');
    }

    return updated;
  }
  /**
   * @deprecated Use `deleteAlerts` instead
   */
  async deleteAlert({
    id,
  }: Readonly<{
    id: string;
  }>): Promise<void> {
    const mutation = await this._service.deleteAlert({ id });
    const result = mutation.deleteAlert?.id;
    if (result === undefined) {
      throw new Error('Failed to delete alert');
    }
  }
}
