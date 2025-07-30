import { NotifiService, Types } from '@notifi-network/notifi-graphql';

import {
  CHAINS_WITH_LOGIN_WEB3,
  type LoginParams,
  type LoginWeb3Params,
  SIGNING_MESSAGE,
  type SignMessageParams,
  getStrategyForBlockchain,
  isLoginWeb3Params,
} from '.';
import type {
  AuthParams,
  NotifiFrontendConfiguration,
} from '../../configuration';
import { isUnmaintainedBlockchain, isUsingBtcBlockchain } from '../../models';
import { Authorization, NotifiStorage, Roles } from '../../storage';
import { notNullOrEmpty } from '../../utils';

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
    const { tenantId, walletBlockchain } = this._configuration;
    if (walletBlockchain !== loginParams.walletBlockchain)
      throw new Error(
        `.logIn - blockchain mismatch: ${walletBlockchain} !== ${loginParams.walletBlockchain}`,
      );
    if (isUnmaintainedBlockchain(loginParams.walletBlockchain))
      throw new Error(
        `Unsupported blockchain: ${loginParams.walletBlockchain}. Please contact us if you believe this is an error or if you need support for a new blockchain.`,
      );

    let user: Types.UserFragmentFragment | undefined = undefined;
    if (isLoginWeb3Params(loginParams)) {
      /* Case #1: Modern login flow — handles authentication via LoginWithWeb3 */
      user = await this._logInWithWeb3(loginParams);
    } else if (
      ['NEAR', 'ARCH', 'INJECTIVE', 'BITCOIN'].includes(
        loginParams.walletBlockchain,
      )
    ) {
      /* Case #2: Legacy login flow (planned for migration) */
      user = await this._logInLegacy({
        signMessageParams: loginParams,
        timestamp: Math.round(Date.now() / 1000),
      });
    } else if (loginParams.walletBlockchain === 'OFF_CHAIN') {
      /* Case #3: OIDC login flow */
      const authentication = await loginParams.signIn();
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
      throw new Error(`Unsupported wallet blockchain: ${walletBlockchain}`);
    }

    if (!user) return Promise.reject('.logIn: Failed to login');

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

    const strategy = getStrategyForBlockchain(
      loginWeb3Params.walletBlockchain,
      this._service,
      this._configuration,
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
        signingPubkey, // TODO: why not signingPubkey?
      },
    );
    return completeLogInWithWeb3.user;
  }

  /**@deprecated Use _authWithWeb3 instead, will remove after all BlockchainType has been migrated */
  private async _logInLegacy({
    signMessageParams,
    timestamp,
  }: Readonly<{
    signMessageParams: SignMessageParams;
    timestamp: number;
  }>): Promise<Types.UserFragmentFragment | undefined> {
    if (
      this._configuration.walletBlockchain !==
      signMessageParams.walletBlockchain
    ) {
      throw new Error(
        'Sign message params and configuration must have the same blockchain',
      );
    }

    let signedMessage: string | undefined;
    let signature: string | undefined;
    let publicKey: string | undefined;
    let address: string | undefined;

    if (
      isUsingBtcBlockchain(signMessageParams) ||
      // ⬇ INJECTIVE becomes legacy: we should always separate BlockchainType if it supports both EVM & COSMOS. ex. 'INJ_EVM' & 'INJ'
      signMessageParams.walletBlockchain === 'INJECTIVE'
    ) {
      const { walletPublicKey, tenantId, accountAddress } = this
        ._configuration as Extract<
        NotifiFrontendConfiguration,
        Extract<AuthParams, { accountAddress: string }>
      >;
      signedMessage = `${SIGNING_MESSAGE}${walletPublicKey}${tenantId}${timestamp.toString()}`;
      const messageBuffer = new TextEncoder().encode(signedMessage);
      const signedBuffer = await signMessageParams.signMessage(messageBuffer);
      signature = Buffer.from(signedBuffer).toString('base64');
      publicKey = walletPublicKey;
      address = accountAddress;
    } else if (signMessageParams.walletBlockchain === 'NEAR') {
      const { walletPublicKey, accountAddress, tenantId } = this
        ._configuration as Extract<
        NotifiFrontendConfiguration,
        Extract<AuthParams, { accountAddress: string }>
      >;

      signedMessage = `${
        `ed25519:` + walletPublicKey
      }${tenantId}${accountAddress}${timestamp.toString()}`;
      const textAsBuffer = new TextEncoder().encode(signedMessage);
      const hashBuffer = await window.crypto.subtle.digest(
        'SHA-256',
        textAsBuffer,
      );
      const messageBuffer = new Uint8Array(hashBuffer);

      const signedBuffer = await signMessageParams.signMessage(messageBuffer);
      signature = Buffer.from(signedBuffer).toString('base64');
      address = accountAddress;
      publicKey = walletPublicKey;
    } else {
      throw new Error(
        `.authenticate(Legacy): Unsupported wallet blockchain: ${signMessageParams.walletBlockchain}`,
      );
    }

    const result = await this._service.logInFromDapp({
      walletBlockchain: signMessageParams.walletBlockchain,
      walletPublicKey: publicKey,
      accountId: address,
      dappAddress: this._configuration.tenantId,
      timestamp,
      signature,
    });
    return result?.logInFromDapp;
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
