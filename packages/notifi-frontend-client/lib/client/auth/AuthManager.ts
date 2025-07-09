import { NotifiService, Types } from '@notifi-network/notifi-graphql';
import type {
  AuthParams,
  NotifiFrontendConfiguration,
} from 'notifi-frontend-client/lib/configuration';
import {
  isAptosBlockchain,
  isCosmosBlockchain,
  isEvmBlockchain,
  isSolanaBlockchain,
  isUsingBtcBlockchain,
  isUsingUnmaintainedBlockchain,
} from 'notifi-frontend-client/lib/models';
import {
  Authorization,
  NotifiStorage,
  Roles,
} from 'notifi-frontend-client/lib/storage';
import { notNullOrEmpty } from 'notifi-frontend-client/lib/utils';

import {
  AuthenticateResult,
  BlockchainAuthStrategy,
  CHAINS_WITH_LOGIN_WEB3,
  LoginParams,
  LoginWeb3Params,
  SIGNING_MESSAGE,
  SignMessageParams,
} from '.';
import { AptosAuthStrategy } from './AptosAuthStrategy';
import { CosmosAuthStrategy } from './CosmosAuthStrategy';
import { EvmAuthStrategy } from './EvmAuthStrategy';
import { SolanaAuthStrategy } from './SolanaAuthStrategy';

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

// TODO: This is for login() args, need migration

function isLoginWeb3Params(params: LoginParams): params is LoginWeb3Params {
  return CHAINS_WITH_LOGIN_WEB3.includes(
    params.walletBlockchain as (typeof CHAINS_WITH_LOGIN_WEB3)[number],
  );
}
// ⬆ This is used for login() args, need migration

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
      /* Case #1: Modern login flow — handles authentication via LoginWithWeb3 */
      user = await this._logInWithWeb3(loginParams);
    } else if (walletBlockchain === 'OFF_CHAIN') {
      /* Case #2: OIDC login flow */
      const authentication = await this._authenticate({
        signMessageParams: loginParams,
        timestamp,
      });
      if (!('oidcProvider' in authentication)) {
        throw new Error('logIn - Invalid signature - expected OidcCredentials');
      }
      const { oidcProvider, jwt } = authentication;
      const result = await this._service.logInByOidc({
        dappId: tenantId,
        oidcProvider,
        idToken: jwt,
      });
      user = result.logInByOidc.user;
    } else {
      /* Case #3: Legacy login flow (planned for migration) */
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
  }: Omit<
    Types.BeginLogInByTransactionInput,
    'dappAddress'
  >): Promise<Types.BeginLogInByTransactionResult> {
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
  }: Omit<
    Types.CompleteLogInByTransactionInput,
    'dappAddress' | 'randomUuid'
  >): Promise<Types.CompleteLogInByTransactionMutation> {
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

    const strategy = this._getStrategyForBlockchain(
      loginWeb3Params.walletBlockchain,
    );

    const { signMessageParams, signingAddress, signingPubkey, nonce } =
      await strategy.prepareLoginWithWeb3(loginWeb3Params);

    const authentication = await strategy.authenticate(signMessageParams);

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
        signingPubkey: '', // TODO: why not signingPubkey?
      },
    );
    //This is to ensure that hardware wallet logins are given authentication.
    //TODO: This is used for Solana Hardware Wallet Sign. May change in future for various HW wallet signs.
    await this._handleLogInResult(completeLogInWithWeb3.user);

    return completeLogInWithWeb3.user;
  }

  /**@deprecated Use _authWithWeb3 instead, will remove after all BlockchainType has been migrated */
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

    if (
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
      default: {
        throw new Error(
          `.authenticate(Legacy): Unsupported wallet blockchain: ${signMessageParams.walletBlockchain}`,
        );
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

  private _getStrategyForBlockchain(
    blockchain: Types.BlockchainType,
  ): BlockchainAuthStrategy {
    if (isCosmosBlockchain(blockchain)) {
      return new CosmosAuthStrategy(this._service, this._configuration);
    }
    if (isAptosBlockchain(blockchain)) {
      return new AptosAuthStrategy(this._service, this._configuration);
    }
    if (isSolanaBlockchain(blockchain)) {
      return new SolanaAuthStrategy(this._service, this._configuration);
    }
    if (isEvmBlockchain(blockchain)) {
      return new EvmAuthStrategy(this._service, this._configuration);
    }
    throw new Error(
      `ERROR - getStrategyForBlockchain: Unsupported blockchain: ${blockchain}`,
    );
  }
}
