import type {
  NotifiEmitterEvents,
  Types,
} from '@notifi-network/notifi-graphql';
import type { NotifiService } from '@notifi-network/notifi-graphql';

import { type NotifiFrontendConfiguration } from '../configuration';
import {
  type CardConfigItemV1,
  type FusionEventTopic,
  type TenantConfig,
  type TenantConfigV2,
  type TopicMetadata,
} from '../models';
import type { NotifiStorage } from '../storage';
import {
  NotifiFrontendStorage,
  createInMemoryStorageDriver,
  createLocalForageStorageDriver,
} from '../storage';
import { notNullOrEmpty, parseTenantConfig } from '../utils';
import { areIdsEqual } from '../utils/areIdsEqual';
import {
  type AlterTargetGroupParams,
  alterTargetGroupImpl,
} from './alterTargetGroup';
import { AuthManager, LoginParams } from './auth';
import {
  ensureDiscord,
  ensureEmail,
  ensureSlack,
  ensureSms,
  ensureTelegram,
  ensureWeb3,
  renewTelegram,
} from './deprecated';

/**@deprecated use CardConfigItemV2 */
export type CardConfigType = CardConfigItemV1;

type BeginLoginProps = Omit<Types.BeginLogInByTransactionInput, 'dappAddress'>;

type CompleteLoginProps = Omit<
  Types.CompleteLogInByTransactionInput,
  'dappAddress' | 'randomUuid'
>;

type FindSubscriptionCardParams = Omit<Types.FindTenantConfigInput, 'tenant'>;

export class NotifiFrontendClient {
  private _authManager: AuthManager;
  constructor(
    private _configuration: NotifiFrontendConfiguration,
    private _service: NotifiService,
    private _storage: NotifiStorage,
  ) {
    this._authManager = new AuthManager(
      this._service,
      this._storage,
      this._configuration,
    );
  }

  get auth(): AuthManager {
    return this._authManager;
  }

  async fetchFusionData(): Promise<Types.FetchFusionDataQuery> {
    return this._service.fetchFusionData({});
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
      .filter((id): id is string => !!id);

    /* Alerts are immutable, delete the existing instead */
    const alertIdsToDelete = duplicateAlertsIds.map((id) => id);
    await this.deleteAlerts({ ids: alertIdsToDelete });

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
  ): Promise<TenantConfig | TenantConfigV2> {
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

    const tenantConfig = parseTenantConfig(tenantConfigJsonString);
    const fusionEventDescriptors = result.fusionEvents;
    if (!fusionEventDescriptors)
      throw new Error('fusionEventDescriptors not found');

    const fusionEventDescriptorMap = new Map<
      string,
      Types.FusionEventDescriptor
    >(fusionEventDescriptors.map((item) => [item?.name ?? '', item ?? {}]));

    fusionEventDescriptorMap.delete('');

    const topicMetadatas = tenantConfig.eventTypes.map((eventType) => {
      if (eventType.type === 'fusion') {
        const fusionEventDescriptor = fusionEventDescriptorMap.get(
          eventType.name,
        );
        return {
          uiConfig: eventType,
          fusionEventDescriptor,
        };
      }
    });

    if (tenantConfig.version === 'v1') {
      // V1 deprecated
      const topicMetadatasV1 = topicMetadatas.filter(
        (item): item is FusionEventTopic => !!item,
      );
      return {
        cardConfig: tenantConfig, // NOTE: cardConfig is legacy naming of tenantConfig
        fusionEventTopics: topicMetadatasV1,
      };
    }

    // V2
    const topicMetadatasV2 = topicMetadatas.filter(
      (item): item is TopicMetadata => !!item,
    );
    return {
      cardConfig: tenantConfig, // NOTE: cardConfig is legacy naming of tenantConfig
      fusionEventTopics: topicMetadatasV2,
    };
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
    onMessageReceived: (data: unknown) => void | undefined,
    onError?: (data: unknown) => void | undefined,
    onComplete?: () => void | undefined,
  ): ReturnType<NotifiService['subscribeNotificationHistoryStateChanged']> {
    return this._service.subscribeNotificationHistoryStateChanged(
      onMessageReceived,
      onError,
      onComplete,
    );
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
  /**@deprecated Use frontendClient.auth.userState instead */
  get userState() {
    return this._authManager.userState;
  }
  /**@deprecated Use frontendClient.auth.initialize instead */
  async initialize() {
    return await this._authManager.initialize();
  }
  /**@deprecated Use frontendClient.auth.logOut instead */
  async logOut() {
    return await this._authManager.logOut();
  }
  /**@deprecated Use frontendClient.auth.logIn instead */
  async logIn(loginParams: LoginParams) {
    const user = await this._authManager.logIn(loginParams);
    return user;
  }
  /**@deprecated Use frontendClient.auth.beginLoginViaTransaction instead */
  async beginLoginViaTransaction(props: BeginLoginProps) {
    return this._authManager.beginLoginViaTransaction(props);
  }
  /**@deprecated Use frontendClient.auth.completeLoginViaTransaction instead */
  async completeLoginViaTransaction(props: CompleteLoginProps) {
    return this._authManager.completeLoginViaTransaction(props);
  }
}
