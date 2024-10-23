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
import { isEqual } from '../utils';

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

  logIn: (
    input: Gql.LogInFromServiceMutationVariables['input'],
  ) => Promise<Gql.LogInFromServiceMutation['logInFromService']> = async (
    input,
  ) => {
    const results = await this.service.logInFromService({ input });
    const authorization = results.logInFromService;
    if (authorization === undefined) {
      throw new Error('Log in failed!');
    }
    this.clientState = { status: 'initialized', jwt: authorization.token };
    return authorization;
  };

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

  async getTenantUser(params: Gql.GetTenantUserQueryVariables) {
    this.isClientValid('getTenantUser');
    const result = await this.service.getTenantUser(params);
    const connection = result.tenantUser;
    if (connection === undefined) {
      throw new Error('Get tenant user failed');
    }

    return connection;
  }

  async updateTargetGroup(
    targetGroup: Gql.TargetGroupFragmentFragment,
    webhook: Gql.WebhookTargetFragmentFragment,
  ): Promise<Gql.TargetGroupFragmentFragment> {
    this.isClientValid('updateTargetGroup');
    const updateResult = await this.service.updateTargetGroup({
      id: targetGroup.id,
      name: targetGroup.name ?? targetGroup.id,
      emailTargetIds: [],
      smsTargetIds: [],
      telegramTargetIds: [],
      webhookTargetIds: [webhook.id],
      discordTargetIds: [],
      slackChannelTargetIds: [],
      web3TargetIds: [],
    });

    const updated = updateResult.updateTargetGroup;
    if (updated === undefined) {
      throw new Error('Failed to update targetGroup');
    }

    return updated;
  }

  async createOrUpdateWebhook(
    params: Gql.CreateWebhookTargetMutationVariables,
  ): Promise<Gql.WebhookTargetFragmentFragment> {
    this.isClientValid('createOrUpdateWebhook');
    const getResult = await this.service.getWebhookTargets({});
    const existing = getResult.webhookTarget?.find((w) => {
      return w.url === params.url && w.format === params.format;
    });

    if (existing === undefined) {
      const createResult = await this.service.createWebhookTarget(params);
      const result = createResult.createWebhookTarget;
      if (result === undefined) {
        throw new Error('Failed to create webhook target');
      }
      return result;
    }

    if (isEqual(existing.headers, params.headers)) {
      return existing;
    }

    const deleteResult = await this.service.deleteWebhookTarget({
      id: existing.id,
    });
    if (deleteResult.deleteWebhookTarget?.id === undefined) {
      throw new Error('Failed to delete webhook target');
    }

    const recreateResult = await this.service.createWebhookTarget(params);
    const recreated = recreateResult.createWebhookTarget;
    if (recreated === undefined) {
      throw new Error('Failed to recreate webhook target');
    }
    return recreated;
  }

  subscribeTenantEntityUpdated(
    onTenantEntityUpdate: (event: Gql.TenantEntityChangeEvent) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void,
  ) {
    this.isClientValid('subscribeTenantEntityUpdated');
    return this.service.subscribeTenantEntityUpdated(
      (data) => {
        if (isTenantEntityUpdateEvent(data)) onTenantEntityUpdate(data);
      },
      onError,
      onComplete,
    );
  }

  addEventListener<K extends keyof NotifiEmitterEvents>(
    event: K,
    callBack: (...args: NotifiEmitterEvents[K]) => void,
  ) {
    if (this.clientState.status !== 'initialized')
      throw new Error(
        'notifi-node - addEventListener: Client not initialized, call initialize() first',
      );
    return this.service.addEventListener(event, callBack);
  }

  removeEventListener<K extends keyof NotifiEmitterEvents>(
    event: K,
    callBack: (...args: NotifiEmitterEvents[K]) => void,
  ) {
    this.isClientValid('removeEventListener');
    return this.service.removeEventListener(event, callBack);
  }
  // TODO: ⬇ is to close websocket connection, we should not allow SDK to directly manipulate websocket connection. Instead, we should allow users to unsubscribe from the subscription.
  // disposeWebSocket = async (jwt: string) => {
  //   this.service.setJwt(jwt);
  //   await this.service.wsDispose();
  // };

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

// Utils

const isTenantEntityUpdateEvent = (
  data: unknown,
): data is Gql.TenantEntityChangeEvent => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'typename' in data &&
    (data.typename === 'UserCreatedEvent' ||
      data.typename === 'AlertCreatedEvent' ||
      data.typename === 'AlertDeletedEvent')
  );
};
