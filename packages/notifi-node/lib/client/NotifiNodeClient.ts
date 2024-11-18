import {
  FusionMessage,
  NotifiDataplaneClient,
  PublishFusionMessageResponse,
} from '@notifi-network/notifi-dataplane';
import {
  Types as Gql,
  NotifiEmitterEvents,
  NotifiService,
} from '@notifi-network/notifi-graphql';

type NotifiNodeclientUninitializedState = Readonly<{
  status: 'uninitialized';
}>;

type NotifiNodeclientInitializedState = Readonly<{
  status: 'initialized';
  jwt: string;
}>;

type NotifiNodeclientStatus =
  | NotifiNodeclientUninitializedState
  | NotifiNodeclientInitializedState;

export class NotifiNodeClient {
  private clientState: NotifiNodeclientStatus = { status: 'uninitialized' };
  constructor(
    private service: NotifiService,
    private dpapiService?: NotifiDataplaneClient,
  ) {}

  initialize(jwt: string): NotifiNodeclientStatus {
    this.service.setJwt(jwt);
    this.clientState = { status: 'initialized', jwt };
    return this.clientState;
  }

  async logIn(
    input: Gql.LogInFromServiceMutationVariables['input'],
  ): Promise<Gql.LogInFromServiceMutation['logInFromService']> {
    const results = await this.service.logInFromService({ input });
    const authorization = results.logInFromService;
    if (authorization === undefined) {
      throw new Error('Log in failed!');
    }
    this.clientState = { status: 'initialized', jwt: authorization.token };
    return authorization;
  }

  get status(): NotifiNodeclientStatus {
    return this.clientState;
  }

  publishFusionMessage(
    params: Readonly<FusionMessage[]>,
  ): Promise<PublishFusionMessageResponse> {
    if (
      !this.dpapiService ||
      !this.isClientValid('publishFusionMessage', this.clientState)
    ) {
      throw new Error(
        'Error: Data plane service not available, make sure dpapiService is provided in constructor',
      );
    }
    return this.dpapiService.publishFusionMessage(this.clientState.jwt, params);
  }

  async createTenantUser(
    params: Gql.CreateTenantUserMutationVariables['input'],
  ): Promise<string /* UserID */> {
    this.isClientValid('createTenantUser');
    const result = await this.service.createTenantUser({
      input: params,
    });

    const userId = result.createTenantUser?.id;
    if (userId === undefined) {
      throw new Error('Create tenant user failed');
    }

    return userId;
  }

  async getTenantConnectedWallet(
    params: Gql.GetTenantConnectedWalletQueryVariables,
  ): Promise<Gql.GetTenantConnectedWalletQuery['tenantConnectedWallet']> {
    this.isClientValid('getTenantConnectedWallet');
    const result = await this.service.getTenantConnectedWallets(params);
    const connection = result.tenantConnectedWallet;
    if (connection === undefined) {
      throw new Error('Get tenant connected wallet failed');
    }

    return connection;
  }

  async getActiveAlerts(
    params: Gql.GetActiveAlertsQueryVariables,
  ): Promise<Gql.GetActiveAlertsQuery['activeAlerts']> {
    this.isClientValid('getActiveAlerts');
    const result = await this.service.getActiveAlerts(params);
    const connection = result.activeAlerts;
    if (connection === undefined) {
      throw new Error('Get active alerts failed');
    }
    return connection;
  }

  /**
   * @important To remove event listener, check the README.md of `notifi-node` package for more details. https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node
   */
  addEventListener<T extends keyof NotifiEmitterEvents>(
    event: T,
    callBack: (...args: NotifiEmitterEvents[T]) => void,
  ) {
    if (this.clientState.status !== 'initialized')
      throw new Error(
        'notifi-node - addEventListener: Client not initialized, call initialize() first',
      );
    return this.service.addEventListener(event, callBack);
  }
  /**
   * @important To remove event listener, check the README.md of `notifi-node` or `notifi-frontend-client` package for more details.
   * - `notifi-node`:  https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-node
   * - `notifi-frontend-client`:  https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-frontend-client
   */
  removeEventListener<T extends keyof NotifiEmitterEvents>(
    event: T,
    id: string,
  ) {
    this.isClientValid('removeEventListener');
    return this.service.removeEventListener(event, id);
  }

  /** NOTE: throw if client is not initialized */
  private isClientValid(
    method: keyof NotifiNodeClient,
    client: NotifiNodeclientStatus = this.clientState,
  ): client is NotifiNodeclientInitializedState {
    if (client.status !== 'initialized')
      throw new Error(
        `notifi-node - ${method}: Client not initialized, call initialize() first`,
      );
    return true;
  }
}
