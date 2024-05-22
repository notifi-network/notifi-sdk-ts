import { Types } from '@notifi-network/notifi-graphql';
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
import { ensureSourceAndFilters, normalizeHexString } from './ensureSource';
import {
  ensureDiscord,
  ensureEmail,
  ensureSlack,
  ensureSms,
  ensureTelegram,
  ensureWeb3,
  ensureWebhook,
} from './ensureTarget';

export type SignMessageParams =
  | Readonly<{
      walletBlockchain: 'SOLANA';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain:
        | 'ETHEREUM'
        | 'POLYGON'
        | 'ARBITRUM'
        | 'AVALANCHE'
        | 'BINANCE'
        | 'OSMOSIS'
        | 'THE_ROOT_NETWORK'
        | 'ELYS'
        | 'NEUTRON'
        | 'ARCHWAY'
        | 'AXELAR'
        | 'BERACHAIN'
        | 'NIBIRU'
        | 'OPTIMISM'
        | 'ZKSYNC'
        | 'INJECTIVE'
        | 'BASE'
        | 'BLAST'
        | 'CELO'
        | 'MANTLE'
        | 'LINEA'
        | 'SCROLL'
        | 'MANTA'
        | 'EVMOS'
        | 'MONAD'
        | 'AGORIC'
        | 'ORAI'
        | 'KAVA'
        | 'CELESTIA'
        | 'COSMOS'
        | 'DYMENSION'
        | 'PERSISTENCE'
        | 'DYDX'
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'APTOS';
      signMessage: AptosSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'XION';
      message: string;
      signMessage: XionSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'ACALA';
      signMessage: AcalaSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'NEAR';
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'SUI';
      signMessage: Uint8SignMessageFunction;
    }>;

export type WalletWithSignParams = Readonly<{
  displayName?: string;
}> &
  WalletWithSignMessage;

export type WalletWithSignMessage =
  | Readonly<{
      walletBlockchain: 'SOLANA';
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain:
        | 'ETHEREUM'
        | 'POLYGON'
        | 'ARBITRUM'
        | 'AVALANCHE'
        | 'BINANCE'
        | 'OPTIMISM'
        | 'THE_ROOT_NETWORK'
        | 'ZKSYNC'
        | 'BASE'
        | 'BLAST'
        | 'CELO'
        | 'MANTLE'
        | 'LINEA'
        | 'SCROLL'
        | 'MANTA'
        | 'MONAD'
        | 'EVMOS'
        | 'BERACHAIN';
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'APTOS';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: AptosSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'XION';
      walletPublicKey: string;
      signingAddress: string;
      signingPubkey: string;
      message: string;
      signMessage: XionSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'ACALA';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: AcalaSignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'NEAR';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'SUI';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'INJECTIVE';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'ELYS';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'NEUTRON';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'ARCHWAY';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
      walletBlockchain: 'AXELAR';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
    | Readonly<{
      walletBlockchain: 'AGORIC';
      accountAddress: string;
      walletPublicKey: string;
      signMessage: Uint8SignMessageFunction;
    }>
  | Readonly<{
    walletBlockchain: 'ORAI';
    accountAddress: string;
    walletPublicKey: string;
    signMessage: Uint8SignMessageFunction;
  }>
  | Readonly<{
    walletBlockchain: 'KAVA';
    accountAddress: string;
    walletPublicKey: string;
    signMessage: Uint8SignMessageFunction;
  }>
  | Readonly<{
    walletBlockchain: 'CELESTIA';
    accountAddress: string;
    walletPublicKey: string;
    signMessage: Uint8SignMessageFunction;
  }>
  | Readonly<{
    walletBlockchain: 'COSMOS';
    accountAddress: string;
    walletPublicKey: string;
    signMessage: Uint8SignMessageFunction;
  }>
  | Readonly<{
    walletBlockchain: 'DYMENSION';
    accountAddress: string;
    walletPublicKey: string;
    signMessage: Uint8SignMessageFunction;
  }>
  | Readonly<{
    walletBlockchain: 'PERSISTENCE';
    accountAddress: string;
    walletPublicKey: string;
    signMessage: Uint8SignMessageFunction;
  }>
  | Readonly<{
    walletBlockchain: 'DYDX';
    accountAddress: string;
    walletPublicKey: string;
    signMessage: Uint8SignMessageFunction;
  }>;

export type ConnectWalletParams = Readonly<{
  walletParams: WalletWithSignParams;
  connectWalletConflictResolutionTechnique: Types.ConnectWalletInput['connectWalletConflictResolutionTechnique'];
}>;

// TODO: Clean up blockchain-specific dependencies out of this package
export type XionSignMessageFunction = (message: Uint8Array) => Promise<string>;

export type Uint8SignMessageFunction = (
  message: Uint8Array,
) => Promise<Uint8Array>;
export type AptosSignMessageFunction = (
  message: string,
  nonce: number,
) => Promise<string>;
type hexString = `0x${string}`;
export type AcalaSignMessageFunction = (
  acalaAddress: string,
  message: string,
) => Promise<hexString>;

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

type EnsureWebhookParams = Omit<
  Types.CreateWebhookTargetMutationVariables,
  'name'
>;

type FindSubscriptionCardParams = Omit<Types.FindTenantConfigInput, 'tenant'>;

// Don't split this line into multiple lines due to some packagers or other build modules that
// modify the string literal, which then causes authentication to fail due to different strings
export const SIGNING_MESSAGE = `Sign in with Notifi \n\n    No password needed or gas is needed. \n\n    Clicking “Approve” only means you have proved this wallet is owned by you! \n\n    This request will not trigger any transaction or cost any gas fees. \n\n    Use of our website and service is subject to our terms of service and privacy policy. \n \n 'Nonce:' `;

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
        console.log('Failed to refresh Notifi token', e);
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

  private async logInWithWeb3(signMessageParams: {
    walletBlockchain: 'XION';
    signMessage: XionSignMessageFunction;
  }): Promise<Types.UserFragmentFragment> {
    let user: Types.UserFragmentFragment | undefined = undefined;

    if (
      this._configuration.walletBlockchain !== 'XION' ||
      signMessageParams.walletBlockchain !== 'XION'
    ) {
      throw new Error('Wallet blockchain must be XION for loginWithWeb3');
    }
    if (checkIsConfigWithDelegate(this._configuration)) {
      const { delegatedAddress, delegatedPublicKey, delegatorAddress } =
        this._configuration;
      const { nonce } = await this.beginLogInWithWeb3({
        authAddress: delegatorAddress,
        authType: 'COSMOS_AUTHZ_GRANT',
      });

      const message = `${SIGNING_MESSAGE}${nonce}}`;
      const params = {
        walletBlockchain: 'XION',
        message,
        signMessage: signMessageParams.signMessage,
      } as const;
      const signature = await this._signMessage({
        signMessageParams: params,
        timestamp: Math.round(Date.now() / 1000),
      });

      const { completeLogInWithWeb3 } = await this.completeLogInWithWeb3({
        nonce,
        signature,
        signedMessage: message,
        signingAddress: delegatedAddress,
        signingPubkey: delegatedPublicKey,
      });
      user = completeLogInWithWeb3.user;
    } else if (checkIsConfigWithPublicKeyAndAddress(this._configuration)) {
      const { authenticationKey, accountAddress } = this._configuration;
      const { nonce } = await this.beginLogInWithWeb3({
        authAddress: accountAddress,
        authType: 'COSMOS_ADR36',
      });

      const message = `${SIGNING_MESSAGE}${nonce}}`;
      const params = {
        walletBlockchain: 'XION',
        message,
        signMessage: signMessageParams.signMessage,
      } as const;
      const signature = await this._signMessage({
        signMessageParams: params,
        timestamp: Math.round(Date.now() / 1000),
      });

      const { completeLogInWithWeb3 } = await this.completeLogInWithWeb3({
        nonce,
        signature,
        signedMessage: message,
        signingAddress: accountAddress,
        signingPubkey: authenticationKey,
      });
      user = completeLogInWithWeb3.user;
    }

    if (user === undefined) {
      return Promise.reject('Failed to login');
    }

    await this._handleLogInResult(user);
    return user;
  }

  async logIn(
    signMessageParams: SignMessageParams,
  ): Promise<Types.UserFragmentFragment> {
    const timestamp = Math.round(Date.now() / 1000);
    const signature = await this._signMessage({
      signMessageParams,
      timestamp,
    });

    const { tenantId, walletBlockchain } = this._configuration;

    if (
      walletBlockchain === 'XION' &&
      signMessageParams.walletBlockchain === 'XION'
    ) {
      return this.logInWithWeb3(signMessageParams);
    }

    let loginResult: Types.UserFragmentFragment | undefined = undefined;
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
      case 'EVMOS':
      case 'SOLANA': {
        const result = await this._service.logInFromDapp({
          walletBlockchain,
          walletPublicKey: this._configuration.walletPublicKey,
          dappAddress: tenantId,
          timestamp,
          signature,
        });
        loginResult = result.logInFromDapp;
        break;
      }
      case 'SUI':
      case 'ACALA':
      case 'NEAR':
      case 'INJECTIVE':
      case 'OSMOSIS':
      case 'ELYS':
      case 'ARCHWAY':
      case 'AXELAR':
      case 'AGORIC':
      case 'CELESTIA':
      case 'COSMOS':
      case 'DYMENSION':
      case 'PERSISTENCE':
      case 'DYDX':
      case 'ORAI':
      case 'KAVA':
      case 'NEUTRON':
      case 'NIBIRU':
      case 'APTOS': {
        const result = await this._service.logInFromDapp({
          walletBlockchain,
          walletPublicKey: this._configuration.authenticationKey,
          accountId: this._configuration.accountAddress,
          dappAddress: tenantId,
          timestamp,
          signature,
        });
        loginResult = result.logInFromDapp;
        break;
      }
    }

    if (loginResult === undefined) {
      return Promise.reject('Failed to login');
    }

    await this._handleLogInResult(loginResult);
    return loginResult;
  }

  private async _signMessage({
    signMessageParams,
    timestamp,
  }: Readonly<{
    signMessageParams: SignMessageParams;
    timestamp: number;
  }>): Promise<string> {
    if (
      this._configuration.walletBlockchain !==
      signMessageParams.walletBlockchain
    ) {
      throw new Error(
        'Sign message params and configuration must have the same blockchain',
      );
    }
    switch (signMessageParams.walletBlockchain) {
      case 'ETHEREUM':
      case 'BERACHAIN':
      case 'POLYGON':
      case 'ARBITRUM':
      case 'AVALANCHE':
      case 'BINANCE':
      case 'BASE':
      case 'BLAST':
      case 'CELO':
      case 'MANTLE':
      case 'LINEA':
      case 'SCROLL':
      case 'MANTA':
      case 'MONAD':
      case 'EVMOS':
      case 'THE_ROOT_NETWORK':
      case 'OPTIMISM': {
        const { walletPublicKey, tenantId } = this
          ._configuration as NotifiConfigWithPublicKey;
        const messageBuffer = new TextEncoder().encode(
          `${SIGNING_MESSAGE}${walletPublicKey}${tenantId}${timestamp.toString()}`,
        );

        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = normalizeHexString(
          Buffer.from(signedBuffer).toString('hex'),
        );

        return signature;
      }
      case 'OSMOSIS':
      case 'ZKSYNC':
      case 'ELYS':
      case 'NEUTRON':
      case 'NIBIRU':
      case 'ARCHWAY':
      case 'AXELAR':
      case 'AGORIC':
      case 'CELESTIA':
      case 'COSMOS':
      case 'DYMENSION':
      case 'PERSISTENCE':
      case 'DYDX':
      case 'ORAI':
      case 'KAVA':
      case 'INJECTIVE': {
        const { authenticationKey, tenantId } = this
          ._configuration as NotifiConfigWithPublicKeyAndAddress;
        const messageBuffer = new TextEncoder().encode(
          `${SIGNING_MESSAGE}${authenticationKey}${tenantId}${timestamp.toString()}`,
        );

        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = Buffer.from(signedBuffer).toString('base64');
        return signature;
      }
      case 'SOLANA': {
        const { walletPublicKey, tenantId } = this
          ._configuration as NotifiConfigWithPublicKey;
        const messageBuffer = new TextEncoder().encode(
          `${SIGNING_MESSAGE}${walletPublicKey}${tenantId}${timestamp.toString()}`,
        );

        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = Buffer.from(signedBuffer).toString('base64');
        return signature;
      }
      case 'XION': {
        const { message } = signMessageParams;
        const messageBuffer = new TextEncoder().encode(message);

        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = Buffer.from(signedBuffer).toString('base64');
        return signature;
      }
      case 'ACALA': {
        const { accountAddress, tenantId } = this
          ._configuration as NotifiConfigWithPublicKeyAndAddress;

        const message = `${SIGNING_MESSAGE}${accountAddress}${tenantId}${timestamp.toString()}`;
        const signedBuffer = await signMessageParams.signMessage(
          accountAddress,
          message,
        );
        return signedBuffer;
      }
      case 'APTOS': {
        const signature = await signMessageParams.signMessage(
          SIGNING_MESSAGE,
          timestamp,
        );
        return signature;
      }
      case 'SUI': {
        const { accountAddress, tenantId } = this
          ._configuration as NotifiConfigWithPublicKeyAndAddress;
        const messageBuffer = new TextEncoder().encode(
          `${SIGNING_MESSAGE}${accountAddress}${tenantId}${timestamp.toString()}`,
        );
        const signedBuffer = await signMessageParams.signMessage(messageBuffer);
        const signature = signedBuffer.toString();
        return signature;
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
        return signature;
      }
      default:
        // Need implementation for other blockchains
        return 'Chain not yet supported';
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

  async fetchData(): Promise<Types.FetchDataQuery> {
    return this._service.fetchData({});
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
    const logValue =
      'Notifi Auth: 0x' +
      hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
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

  async beginLogInWithWeb3({
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

  async ensureTargetGroup({
    name,
    emailAddress,
    phoneNumber,
    telegramId,
    webhook,
    discordId,
    slackId,
    walletId,
  }: Readonly<{
    name: string;
    emailAddress?: string;
    phoneNumber?: string;
    telegramId?: string;
    webhook?: EnsureWebhookParams;
    discordId?: string;
    slackId?: string;
    walletId?: string;
  }>): Promise<Types.TargetGroupFragmentFragment> {
    const [
      targetGroupsQuery,
      emailTargetId,
      smsTargetId,
      telegramTargetId,
      webhookTargetId,
      discordTargetId,
      slackTargetId,
      web3TargetId,
    ] = await Promise.all([
      this._service.getTargetGroups({}),
      ensureEmail(this._service, emailAddress),
      ensureSms(this._service, phoneNumber),
      ensureTelegram(this._service, telegramId),
      ensureWebhook(this._service, webhook),
      ensureDiscord(this._service, discordId),
      ensureSlack(this._service, slackId),
      ensureWeb3(this._service, walletId),
    ]);

    const emailTargetIds = emailTargetId === undefined ? [] : [emailTargetId];
    const smsTargetIds = smsTargetId === undefined ? [] : [smsTargetId];
    const telegramTargetIds =
      telegramTargetId === undefined ? [] : [telegramTargetId];
    const webhookTargetIds =
      webhookTargetId === undefined ? [] : [webhookTargetId];
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
        webhookTargetIds,
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
      webhookTargetIds,
      discordTargetIds,
      slackChannelTargetIds,
      web3TargetIds,
    });

    if (createMutation.createTargetGroup === undefined) {
      throw new Error('Failed to create target group');
    }

    return createMutation.createTargetGroup;
  }

  private async _updateTargetGroup({
    existing,
    emailTargetIds,
    smsTargetIds,
    telegramTargetIds,
    webhookTargetIds,
    discordTargetIds,
    slackChannelTargetIds,
    web3TargetIds,
  }: Readonly<{
    existing: Types.TargetGroupFragmentFragment;
    emailTargetIds: Array<string>;
    smsTargetIds: Array<string>;
    telegramTargetIds: Array<string>;
    webhookTargetIds: Array<string>;
    discordTargetIds: Array<string>;
    slackChannelTargetIds: Array<string>;
    web3TargetIds: Array<string>;
  }>): Promise<Types.TargetGroupFragmentFragment> {
    if (
      areIdsEqual(emailTargetIds, existing.emailTargets ?? []) &&
      areIdsEqual(smsTargetIds, existing.smsTargets ?? []) &&
      areIdsEqual(telegramTargetIds, existing.telegramTargets ?? []) &&
      areIdsEqual(webhookTargetIds, existing.webhookTargets ?? []) &&
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
      webhookTargetIds,
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

  async getSourceGroups(): Promise<
    ReadonlyArray<Types.SourceGroupFragmentFragment>
  > {
    const query = await this._service.getSourceGroups({});
    const results = query.sourceGroup?.filter(notNullOrEmpty) ?? [];
    return results;
  }

  async getAlerts(): Promise<ReadonlyArray<Types.AlertFragmentFragment>> {
    const query = await this._service.getAlerts({});
    return query.alert?.filter(notNullOrEmpty) ?? [];
  }

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

    // Alerts are immutable, delete the existing instead
    for (const id of duplicateAlertsIds) {
      await this.deleteAlert({ id });
    }

    const mutation = await this._service.createFusionAlerts({ input });
    return mutation.createFusionAlerts;
  }

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

  /**
   *@deprecated
   *@description Use getFusionNotificationHistory instead
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

  async getUnreadNotificationHistoryCount(): Promise<
    Types.GetUnreadNotificationHistoryCountQuery['unreadNotificationHistoryCount']
  > {
    const query = await this._service.getUnreadNotificationHistoryCount({});
    const result = query.unreadNotificationHistoryCount;
    if (!result) {
      throw new Error('Failed to fetch unread notification history count');
    }
    return result;
  }

  async subscribeNotificationHistoryStateChanged(
    onMessageReceived: (data: any) => void | undefined,
    onError?: (data: any) => void | undefined,
    onComplete?: () => void | undefined,
  ): Promise<void> {
    this._service.subscribeNotificationHistoryStateChanged(
      onMessageReceived,
      onError,
      onComplete,
    );
  }

  async wsDispose() {
    this._service.wsDispose();
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

  async subscribeWallet(
    params: ConnectWalletParams,
  ): Promise<Types.ConnectWalletMutation> {
    const { walletBlockchain, signMessage, walletPublicKey } =
      params.walletParams;
    const signMessageParams = {
      walletBlockchain,
      signMessage,
    } as SignMessageParams;

    if (this._userState && this._userState.status === 'authenticated') {
      await this.logIn(signMessageParams);
    }
    const timestamp = Math.round(Date.now() / 1000);
    const signature = await this._signMessage({
      signMessageParams,
      timestamp,
    });
    const connectedWallet = await this._service.connectWallet({
      walletBlockchain,
      walletPublicKey,
      accountId:
        walletBlockchain === 'APTOS' ||
        walletBlockchain === 'ACALA' ||
        walletBlockchain === 'NEAR' ||
        walletBlockchain === 'SUI'
          ? params.walletParams.accountAddress
          : undefined,
      signature,
      timestamp,
      connectWalletConflictResolutionTechnique:
        params.connectWalletConflictResolutionTechnique,
    });
    return connectedWallet;
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
    const mutation = await this._service.markFusionNotificationHistoryAsRead(
      input,
    );
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
}
