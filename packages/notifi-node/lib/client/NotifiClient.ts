import {
  FusionMessage,
  NotifiDataplaneClient,
  PublishFusionMessageResponse,
} from '@notifi-network/notifi-dataplane';
import { Types as Gql, NotifiService } from '@notifi-network/notifi-graphql';

import type {
  Authorization,
  GetTenantConnectedWalletResult,
  GetTenantUserResult,
  ManagedAlert,
  SimpleHealthThresholdMessagePayload,
} from '../types';
import {
  newDirectTenantMessage,
  newSimpleHealthThresholdMessage,
} from '../types';

class NotifiClient {
  constructor(
    private service: NotifiService,
    private dpapiService?: NotifiDataplaneClient,
  ) { }

  logIn: (
    input: Gql.LogInFromServiceMutationVariables['input'],
  ) => Promise<Authorization> = async (input) => {
    const results = await this.service.logInFromService({ input });
    const authorization = results.logInFromService;
    if (authorization === undefined) {
      throw new Error('Log in failed!');
    }
    return authorization;
  };

  sendSimpleHealthThreshold: (
    jwt: string,
    params: Readonly<{
      key: string;
      walletPublicKey: string;
      walletBlockchain: Gql.WalletBlockchain;
    }> &
      SimpleHealthThresholdMessagePayload,
  ) => Promise<void> = async (
    jwt,
    { key, walletPublicKey, walletBlockchain, ...payload },
  ) => {
      const message = newSimpleHealthThresholdMessage(payload);
      const input = {
        walletPublicKey,
        walletBlockchain,
        messageKey: key,
        messageType: message.type,
        message: JSON.stringify(message.payload),
      };

      this.service.setJwt(jwt);
      const result = await this.service.sendMessage({ input });
      if (!result.sendMessage) {
        throw new Error('Send message failed');
      }
    };

  sendBroadcastMessage: (
    jwt: string,
    params: Omit<
      Gql.BroadcastMessageMutationVariables,
      'timestamp' | 'walletBlockchain' | 'signature'
    >,
  ) => Promise<void> = async (jwt, params) => {
    this.service.setJwt(jwt);
    const result = await this.service.broadcastMessage({
      ...params,
      timestamp: 0,
      walletBlockchain: 'OFF_CHAIN',
      signature: '',
    });

    if (result.broadcastMessage?.id === undefined) {
      throw new Error('broadcast message failed');
    }
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

  sendDirectPush: (
    jwt: string,
    params: Readonly<{
      key: string;
      walletPublicKey: string;
      walletBlockchain: Gql.WalletBlockchain;
      message?: string;
      type?: string;
      template?: {
        emailTemplate?: string;
        smsTemplate?: string;
        telegramTemplate?: string;
        variables: Record<string, string>;
      };
    }>,
  ) => Promise<void> = async (
    jwt,
    { key, walletPublicKey, walletBlockchain, message, template, type },
  ) => {
      let directMessage;
      if (message !== undefined) {
        directMessage = newDirectTenantMessage({ message, type });
      } else if (template !== undefined) {
        directMessage = newDirectTenantMessage({
          message: '',
          type,
          targetTemplates: {
            SMS: template.smsTemplate ?? undefined,
            Email: template.emailTemplate ?? undefined,
            Telegram: template.telegramTemplate ?? undefined,
          },
          templateVariables: template.variables,
        });
      } else {
        throw new Error('One of message or template must be set');
      }

      const input = {
        walletPublicKey,
        walletBlockchain,
        messageKey: key,
        messageType: directMessage.type,
        message: JSON.stringify(directMessage.payload),
      };

      this.service.setJwt(jwt);
      const result = await this.service.sendMessage({
        input,
      });

      if (!result.sendMessage) {
        throw new Error('Send message failed');
      }
    };

  deleteUserAlert: (
    jwt: string,
    params: Gql.DeleteUserAlertMutationVariables,
  ) => Promise<string /* AlertID */> = async (jwt, params) => {
    this.service.setJwt(jwt);
    const result = await this.service.deleteUserAlert(params);
    const deletedId = result.deleteUserAlert?.id;
    if (deletedId === undefined) {
      throw new Error('Delete user alert failed');
    }
    return deletedId;
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

  // TODO: Deprecate ManagedAlert type
  createDirectPushAlert: (
    jwt: string,
    params: Gql.CreateDirectPushAlertMutationVariables['input'],
  ) => Promise<ManagedAlert> = async (jwt, input) => {
    this.service.setJwt(jwt);
    const result = await this.service.createDirectPushAlert({
      input,
    });
    const alertId = result.createDirectPushAlert?.id;
    if (alertId === undefined) {
      throw new Error('Create direct push alert failed');
    }

    return {
      id: alertId,
    };
  };

  // TODO: Deprecate ManagedAlert type
  deleteDirectPushAlert: (
    jwt: string,
    params: Gql.DeleteDirectPushAlertMutationVariables['input'],
  ) => Promise<ManagedAlert> = async (jwt, input) => {
    this.service.setJwt(jwt);
    const result = await this.service.DeleteDirectPushAlert({ input });
    const alertId = result.deleteDirectPushAlert?.id;
    if (alertId === undefined) {
      throw new Error('Delete direct push alert failed');
    }

    return {
      id: alertId,
    };
  };

  getTenantConnectedWallet: (
    jwt: string,
    params: Gql.GetTenantConnectedWalletQueryVariables,
  ) => Promise<GetTenantConnectedWalletResult> = async (jwt, params) => {
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
  ) => Promise<GetTenantUserResult> = async (jwt, params) => {
    this.service.setJwt(jwt);
    const result = await this.service.getTenantUser(params);
    const connection = result.tenantUser;
    if (connection === undefined) {
      throw new Error('Get tenant user failed');
    }

    return connection;
  };

  createTenantBalanceChangeAlert: (
    jwt: string,
    params: Readonly<{
      name: string;
      webhook: Gql.CreateWebhookTargetMutationVariables;
    }>,
  ) => Promise<Gql.AlertFragmentFragment> = async (jwt, { name, webhook }) => {
    this.service.setJwt(jwt);

    const webhookTarget = await this.createOrUpdateWebhook(webhook);

    const alertsResult = await this.service.getAlerts({});
    const alerts = alertsResult.alert;
    if (alerts === undefined) {
      throw new Error('Failed to fetch existing alerts');
    }

    const existing = alerts.find((a) => a?.name === name);
    if (existing !== undefined) {
      if (existing.filter.filterType !== 'BALANCE') {
        throw new Error('Incompatible alert filterType.');
      }

      const updatedTargetGroup = await this.updateTargetGroup(
        existing.targetGroup,
        webhookTarget,
      );
      return {
        ...existing,
        targetGroup: updatedTargetGroup,
      };
    }

    const filtersResult = await this.service.getFilters({});
    const balanceFilter = filtersResult.filter?.find(
      (f) => f?.filterType === 'BALANCE',
    );
    if (balanceFilter === undefined) {
      throw new Error('Unable to locate BALANCE filter');
    }

    const sourceGroup = await this.getOrCreateSourceGroup(name);
    const targetGroup = await this.getOrCreateTargetGroup(name, webhookTarget);

    const createResult = await this.service.createAlert({
      name,
      groupName: 'Managed',
      sourceGroupId: sourceGroup.id,
      filterId: balanceFilter.id,
      targetGroupId: targetGroup.id,
      filterOptions: '{}',
    });
    const alert = createResult.createAlert;
    if (alert === undefined) {
      throw new Error('Failed to create alert');
    }

    return alert;
  };

  addSourceToSourceGroup: (
    jwt: string,
    input: Gql.AddSourceToSourceGroupMutationVariables['input'],
  ) => Promise<Gql.SourceGroupFragmentFragment> = async (jwt, input) => {
    this.service.setJwt(jwt);
    const result = await this.service.addSourceToSourceGroup({ input });
    if (result.addSourceToSourceGroup === undefined) {
      throw new Error('Failed to add Source to SourceGroup');
    }

    return result.addSourceToSourceGroup;
  };

  removeSourceFromSourceGroup: (
    jwt: string,
    input: Gql.RemoveSourceFromSourceGroupMutationVariables['input'],
  ) => Promise<Gql.SourceGroupFragmentFragment> = async (jwt, input) => {
    this.service.setJwt(jwt);
    const result = await this.service.removeSourceFromSourceGroup({ input });
    if (result.removeSourceFromSourceGroup === undefined) {
      throw new Error('Failed to remove Source from SourceGroup');
    }

    return result.removeSourceFromSourceGroup;
  };

  getOrCreateSourceGroup: (
    name: string,
  ) => Promise<Gql.SourceGroupFragmentFragment> = async (name) => {
    const getResult = await this.service.getSourceGroups({});
    if (getResult.sourceGroup === undefined) {
      throw new Error('Failed to get SourceGroups');
    }
    const existing = getResult.sourceGroup.find((sg) => sg?.name === name);
    if (existing !== undefined) {
      return existing;
    }

    const createResult = await this.service.createSourceGroup({
      name,
      sourceIds: [],
    });
    if (createResult.createSourceGroup === undefined) {
      throw new Error('Failed to create SourceGroup');
    }

    return createResult.createSourceGroup;
  };

  getOrCreateTargetGroup: (
    name: string,
    webhookTarget: Gql.WebhookTargetFragmentFragment,
  ) => Promise<Gql.TargetGroupFragmentFragment> = async (
    name,
    webhookTarget,
  ) => {
      const getResult = await this.service.getTargetGroups({});
      if (getResult.targetGroup === undefined) {
        throw new Error('Failed to get TargetGroups');
      }

      const existing = getResult.targetGroup.find((tg) => tg?.name === name);
      if (existing !== undefined) {
        return this.updateTargetGroup(existing, webhookTarget);
      }

      const createResult = await this.service.createTargetGroup({
        name,
        emailTargetIds: [],
        smsTargetIds: [],
        telegramTargetIds: [],
        webhookTargetIds: [webhookTarget.id],
        discordTargetIds: [],
        slackChannelTargetIds: [],
        web3TargetIds: [],
        webPushTargetIds: [],
      });
      if (createResult.createTargetGroup === undefined) {
        throw new Error('Failed to create TargetGroup');
      }

      return createResult.createTargetGroup;
    };

  getSourceConnection: (
    jwt: string,
    variables: Gql.GetSourceConnectionQueryVariables['input'] &
      Pick<Gql.GetSourceConnectionQueryVariables, 'after' | 'first'>,
  ) => Promise<Exclude<Gql.GetSourceConnectionQuery['sources'], undefined>> =
    async (jwt, variables) => {
      const { after, first, ...input } = variables;

      const result = await this.service.getSourceConnection({
        after,
        first,
        input,
      });

      if (result.sources === undefined) {
        throw new Error('Failed to fetch SourceConnection');
      }

      return result.sources;
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
        webPushTargetIds: [],
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

    const existingHeaders = keyValuePairsToRecord(existing.headers);
    const desiredHeaders = keyValuePairsToRecord(params.headers);
    if (areRecordsEqual(existingHeaders, desiredHeaders)) {
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
}

// Utils
type Pair = { key: string; value: string };
const keyValuePairsToRecord = (
  pairs: undefined | Pair | Pair[],
): Record<string, string> => {
  const results: Record<string, string> = {};
  if (pairs === undefined) {
    // Nothing to do
  } else if (Array.isArray(pairs)) {
    // Set all values
    pairs.forEach(({ key, value }) => (results[key] = value));
  } else {
    // Singular value
    results[pairs.key] = pairs.value;
  }

  return results;
};

const areRecordsEqual = (
  a: Record<string, string>,
  b: Record<string, string>,
): boolean => {
  const aKeys = Object.keys(a);
  return (
    aKeys.length === Object.keys(b).length &&
    aKeys.every((key) => {
      return b[key] !== undefined && a[key] === b[key];
    })
  );
};

export default NotifiClient;
