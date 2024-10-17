import {
  FusionMessage,
  NotifiDataplaneClient,
  PublishFusionMessageResponse,
} from '@notifi-network/notifi-dataplane';
import { Types as Gql, NotifiService } from '@notifi-network/notifi-graphql';
import { isEqual } from '../utils';

export class NotifiNodeClient {
  constructor(
    private service: NotifiService,
    private dpapiService?: NotifiDataplaneClient,
  ) {}

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
    return authorization;
  };

  publishFusionMessage: (
    jwt: string,
    params: Readonly<FusionMessage[]>,
  ) => Promise<PublishFusionMessageResponse> = async (jwt, params) => {
    this.service.setJwt(jwt);
    if (!this.dpapiService) {
      throw new Error(
        'Error: Data plane service not available, make sure dpapiService is provided in constructor',
      );
    }
    return await this.dpapiService.publishFusionMessage(jwt, params);
  };

  createTenantUser: (
    jwt: string,
    params: Gql.CreateTenantUserMutationVariables['input'],
  ) => Promise<string /* UserID */> = async (jwt, input) => {
    this.service.setJwt(jwt);
    const result = await this.service.createTenantUser({
      input,
    });

    const userId = result.createTenantUser?.id;
    if (userId === undefined) {
      throw new Error('Create tenant user failed');
    }

    return userId;
  };

  getTenantConnectedWallet: (
    jwt: string,
    params: Gql.GetTenantConnectedWalletQueryVariables,
  ) => Promise<Gql.GetTenantConnectedWalletQuery['tenantConnectedWallet']> =
    async (jwt, params) => {
      this.service.setJwt(jwt);
      const result = await this.service.getTenantConnectedWallets(params);
      const connection = result.tenantConnectedWallet;
      if (connection === undefined) {
        throw new Error('Get tenant connected wallet failed');
      }

      return connection;
    };

  getTenantUser: (
    jwt: string,
    params: Gql.GetTenantUserQueryVariables,
  ) => Promise<Gql.GetTenantUserQuery['tenantUser']> = async (jwt, params) => {
    this.service.setJwt(jwt);
    const result = await this.service.getTenantUser(params);
    const connection = result.tenantUser;
    if (connection === undefined) {
      throw new Error('Get tenant user failed');
    }

    return connection;
  };

  updateTargetGroup: (
    targetGroup: Gql.TargetGroupFragmentFragment,
    webhook: Gql.WebhookTargetFragmentFragment,
  ) => Promise<Gql.TargetGroupFragmentFragment> = async (
    targetGroup,
    webhook,
  ) => {
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
  };

  createOrUpdateWebhook: (
    params: Gql.CreateWebhookTargetMutationVariables,
  ) => Promise<Gql.WebhookTargetFragmentFragment> = async (params) => {
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
  };

  subscribeTenantEntityUpdated = (
    jwt: string,
    onTenantEntityUpdate: (event: Gql.TenantEntityChangeEvent) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void,
  ) => {
    this.service.setJwt(jwt);
    return this.service.subscribeTenantEntityUpdated(
      (data) => {
        if (isTenantEntityUpdateEvent(data)) onTenantEntityUpdate(data);
      },
      onError,
      onComplete,
    );
  };
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
