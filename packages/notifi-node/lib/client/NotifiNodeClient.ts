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
   * @returns {string} - The id of the event listener (used to remove the event listener)
   */
  addEventListener<T extends keyof NotifiEmitterEvents>(
    event: T,
    callBack: (...args: NotifiEmitterEvents[T]) => void,
    onError?: (error: unknown) => void,
    onComplete?: () => void,
  ): string {
    if (this.clientState.status !== 'initialized')
      throw new Error(
        'notifi-node - addEventListener: Client not initialized, call initialize() first',
      );
    return this.service.addEventListener(event, callBack, onError, onComplete);
  }

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
