import { GraphQLClient } from 'graphql-request';
import { Subscription } from 'relay-runtime';
import { v4 as uuid } from 'uuid';

import { version } from '../package.json';
import { NotifiEmitterEvents } from './NotifiEventEmitter';
import { NotifiSubscriptionService } from './NotifiSubscriptionService';
import { stateChangedSubscriptionQuery } from './gql';
import * as Generated from './gql/generated';
import { getSdk } from './gql/generated';
import type * as Operations from './operations';

export class NotifiService
  implements
    Operations.BeginLogInByTransactionService,
    Operations.BroadcastMessageService,
    Operations.CompleteLogInByTransactionService,
    Operations.ConnectWalletService,
    Operations.CreateAlertService,
    Operations.CreateDirectPushAlertService,
    Operations.CreateEmailTargetService,
    Operations.CreateSmsTargetService,
    Operations.CreateTargetGroupService,
    Operations.CreateTelegramTargetService,
    Operations.DeleteAlertService,
    Operations.DeleteUserAlertService,
    Operations.DeleteTargetGroupService,
    Operations.FetchDataService,
    Operations.FindTenantConfigService,
    Operations.GetAlertsService,
    Operations.GetConfigurationForDappService,
    Operations.GetConnectedWalletsService,
    Operations.GetEmailTargetsService,
    Operations.GetFiltersService,
    Operations.GetFusionNotificationHistoryService,
    Operations.GetNotificationHistoryService,
    Operations.GetSmsTargetsService,
    Operations.GetTargetGroupsService,
    Operations.GetTelegramTargetsService,
    Operations.GetTopicsService,
    Operations.LogInFromDappService,
    Operations.LogInFromServiceService,
    Operations.RefreshAuthorizationService,
    Operations.SendEmailTargetVerificationRequestService,
    Operations.SendMessageService,
    Operations.UpdateTargetGroupService,
    Operations.CreateDiscordTargetService,
    Operations.GetDiscordTargetsService,
    Operations.GetUnreadNotificationHistoryCountService,
    Operations.MarkFusionNotificationHistoryAsReadService,
    Operations.UpdateUserSettingsService,
    Operations.GetUserSettingsService,
    Operations.GetSlackChannelTargetsService,
    Operations.CreateSlackChannelTargetService,
    Operations.CreateFusionAlertsService,
    Operations.BeginLogInWithWeb3Service,
    Operations.CompleteLogInWithWeb3Service,
    Operations.CreateWeb3TargetService,
    Operations.GetWeb3TargetsService,
    Operations.VerifyCbwTargetService,
    Operations.VerifyXmtpTargetService,
    Operations.VerifyXmtpTargetViaXip42Service,
    Operations.DeleteDiscordTargetService,
    Operations.DeleteEmailTargetService,
    Operations.DeleteTelegramTargetService,
    Operations.DeleteSmsTargetService,
    Operations.DeleteSlackChannelTargetService,
    Operations.DeleteWeb3TargetService,
    Operations.GetSmartLinkConfigService
{
  private _jwt: string | undefined;
  private _typedClient: ReturnType<typeof getSdk>;

  constructor(
    graphQLClient: GraphQLClient,
    private _notifiSubService: NotifiSubscriptionService,
    private _optionHeaders?: Record<string, string>,
  ) {
    this._typedClient = getSdk(graphQLClient);
  }

  setJwt(jwt: string | undefined) {
    this._jwt = jwt;
    this._notifiSubService.setJwt(jwt);
  }

  async logOut(): Promise<void> {
    this._jwt = undefined;
    this._notifiSubService.setJwt(undefined);
  }

  async beginLogInByTransaction(
    variables: Generated.BeginLogInByTransactionMutationVariables,
  ): Promise<Generated.BeginLogInByTransactionMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.beginLogInByTransaction(variables, headers);
  }

  async broadcastMessage(
    variables: Generated.BroadcastMessageMutationVariables,
  ): Promise<Generated.BroadcastMessageMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.broadcastMessage(variables, headers);
  }

  async completeLogInByTransaction(
    variables: Generated.CompleteLogInByTransactionMutationVariables,
  ): Promise<Generated.CompleteLogInByTransactionMutation> {
    const headers = this._requestHeaders();
    const result = await this._typedClient.completeLogInByTransaction(
      variables,
      headers,
    );
    const token = result.completeLogInByTransaction?.authorization?.token;
    if (token !== undefined) {
      this._onAuthComplete(token);
    }
    return result;
  }

  async connectWallet(
    variables: Generated.ConnectWalletMutationVariables,
  ): Promise<Generated.ConnectWalletMutation> {
    const headers = this._requestHeaders();
    return await this._typedClient.connectWallet(variables, headers);
  }

  async createAlert(
    variables: Generated.CreateAlertMutationVariables,
  ): Promise<Generated.CreateAlertMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createAlert(variables, headers);
  }

  async createFusionAlerts(
    variables: Generated.CreateFusionAlertsMutationVariables,
  ): Promise<Generated.CreateFusionAlertsMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createFusionAlerts(variables, headers);
  }

  async createDirectPushAlert(
    variables: Generated.CreateDirectPushAlertMutationVariables,
  ): Promise<Generated.CreateDirectPushAlertMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createDirectPushAlert(variables, headers);
  }

  async createEmailTarget(
    variables: Generated.CreateEmailTargetMutationVariables,
  ): Promise<Generated.CreateEmailTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createEmailTarget(variables, headers);
  }

  async deleteEmailTarget(
    variables: Generated.DeleteEmailTargetMutationVariables,
  ): Promise<Generated.DeleteEmailTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteEmailTarget(variables, headers);
  }

  async createDiscordTarget(
    variables: Generated.CreateDiscordTargetMutationVariables,
  ): Promise<Generated.CreateDiscordTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createDiscordTarget(variables, headers);
  }
  async deleteDiscordTarget(
    variables: Generated.DeleteDiscordTargetMutationVariables,
  ): Promise<Generated.DeleteDiscordTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteDiscordTarget(variables, headers);
  }

  async createSlackChannelTarget(
    variables: Generated.CreateSlackChannelTargetMutationVariables,
  ): Promise<Generated.CreateSlackChannelTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createSlackChannelTarget(variables, headers);
  }

  async deleteSlackChannelTarget(
    variables: Generated.DeleteSlackChannelTargetMutationVariables,
  ): Promise<Generated.DeleteSlackChannelTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteSlackChannelTarget(variables, headers);
  }

  async createWeb3Target(
    variables: Generated.CreateWeb3TargetMutationVariables,
  ): Promise<Generated.CreateWeb3TargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createWeb3Target(variables, headers);
  }

  async deleteWeb3Target(
    variables: Generated.DeleteWeb3TargetMutationVariables,
  ): Promise<Generated.DeleteWeb3TargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteWeb3Target(variables, headers);
  }

  async createSmsTarget(
    variables: Generated.CreateSmsTargetMutationVariables,
  ): Promise<Generated.CreateSmsTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createSmsTarget(variables, headers);
  }

  async deleteSmsTarget(
    variables: Generated.DeleteSmsTargetMutationVariables,
  ): Promise<Generated.DeleteSmsTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteSmsTarget(variables, headers);
  }

  async createTargetGroup(
    variables: Generated.CreateTargetGroupMutationVariables,
  ): Promise<Generated.CreateTargetGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createTargetGroup(variables, headers);
  }

  async deleteTelegramTarget(
    variables: Generated.DeleteTelegramTargetMutationVariables,
  ): Promise<Generated.DeleteTelegramTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteTelegramTarget(variables, headers);
  }

  async createTelegramTarget(
    variables: Generated.CreateTelegramTargetMutationVariables,
  ): Promise<Generated.CreateTelegramTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createTelegramTarget(variables, headers);
  }

  async deleteAlert(
    variables: Generated.DeleteAlertMutationVariables,
  ): Promise<Generated.DeleteAlertMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteAlert(variables, headers);
  }

  async deleteAlerts(
    variables: Generated.DeleteAlertsMutationVariables,
  ): Promise<Generated.DeleteAlertsMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteAlerts(variables, headers);
  }

  async DeleteDirectPushAlert(
    variables: Generated.DeleteDirectPushAlertMutationVariables,
  ): Promise<Generated.DeleteDirectPushAlertMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteDirectPushAlert(variables, headers);
  }

  async deleteUserAlert(
    variables: Generated.DeleteUserAlertMutationVariables,
  ): Promise<Generated.DeleteUserAlertMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteUserAlert(variables, headers);
  }

  async deleteTargetGroup(
    variables: Generated.DeleteTargetGroupMutationVariables,
  ): Promise<Generated.DeleteTargetGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteTargetGroup(variables, headers);
  }

  /** @deprecated use fetchFusionData instead. This is for legacy  */
  async fetchData(
    variables: Generated.FetchDataQueryVariables,
  ): Promise<Generated.FetchDataQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.fetchData(variables, headers);
  }

  async fetchFusionData(
    variables: Generated.FetchFusionDataQueryVariables,
  ): Promise<Generated.FetchFusionDataQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.fetchFusionData(variables, headers);
  }

  async findTenantConfig(
    variables: Generated.FindTenantConfigQueryVariables,
  ): Promise<Generated.FindTenantConfigQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.findTenantConfig(variables, headers);
  }

  async getAlerts(
    variables: Generated.GetAlertsQueryVariables,
  ): Promise<Generated.GetAlertsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getAlerts(variables, headers);
  }

  async getActiveAlerts(
    variables: Generated.GetActiveAlertsQueryVariables,
  ): Promise<Generated.GetActiveAlertsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getActiveAlerts(variables, headers);
  }

  async getConfigurationForDapp(
    variables: Generated.GetConfigurationForDappQueryVariables,
  ): Promise<Generated.GetConfigurationForDappQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getConfigurationForDapp(variables, headers);
  }

  async getConnectedWallets(
    variables: Generated.GetConnectedWalletsQueryVariables,
  ): Promise<Generated.GetConnectedWalletsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getConnectedWallets(variables, headers);
  }

  async getEmailTargets(
    variables: Generated.GetEmailTargetsQueryVariables,
  ): Promise<Generated.GetEmailTargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getEmailTargets(variables, headers);
  }
  async getDiscordTargets(
    variables: Generated.GetDiscordTargetsQueryVariables,
  ): Promise<Generated.GetDiscordTargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getDiscordTargets(variables, headers);
  }

  async getSlackChannelTargets(
    variables: Generated.GetSlackChannelTargetsQueryVariables,
  ): Promise<Generated.GetSlackChannelTargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getSlackChannelTargets(variables, headers);
  }

  async getWeb3Targets(
    variables: Generated.GetWeb3TargetsQueryVariables,
  ): Promise<Generated.GetWeb3TargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getWeb3Targets(variables, headers);
  }

  async getFilters(
    variables: Generated.GetFiltersQueryVariables,
  ): Promise<Generated.GetFiltersQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getFilters(variables, headers);
  }

  async getFusionNotificationHistory(
    variables: Generated.GetFusionNotificationHistoryQueryVariables,
  ): Promise<Generated.GetFusionNotificationHistoryQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getFusionNotificationHistory(variables, headers);
  }

  /**
   * @deprecated Use getFusionNotificationHistory instead
   */
  async getNotificationHistory(
    variables: Generated.GetNotificationHistoryQueryVariables,
  ): Promise<Generated.GetNotificationHistoryQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getNotificationHistory(variables, headers);
  }

  async getSmsTargets(
    variables: Generated.GetSmsTargetsQueryVariables,
  ): Promise<Generated.GetSmsTargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getSmsTargets(variables, headers);
  }

  async getTargetGroups(
    variables: Generated.GetTargetGroupsQueryVariables,
  ): Promise<Generated.GetTargetGroupsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getTargetGroups(variables, headers);
  }

  async getTelegramTargets(
    variables: Generated.GetTelegramTargetsQueryVariables,
  ): Promise<Generated.GetTelegramTargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getTelegramTargets(variables, headers);
  }

  async getTopics(
    variables: Generated.GetTopicsQueryVariables,
  ): Promise<Generated.GetTopicsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getTopics(variables, headers);
  }

  async getUnreadNotificationHistoryCount(
    variables: Generated.GetUnreadNotificationHistoryCountQueryVariables,
  ): Promise<Generated.GetUnreadNotificationHistoryCountQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getUnreadNotificationHistoryCount(
      variables,
      headers,
    );
  }
  /**
   * @deprecated Use addEventListener instead
   */
  subscribeNotificationHistoryStateChanged(
    onMessageReceived: (data: any) => void | undefined,
    onError?: (data: any) => void | undefined,
    onComplete?: () => void | undefined,
  ): Subscription | null {
    return this._notifiSubService.subscribe(
      this._jwt,
      stateChangedSubscriptionQuery,
      onMessageReceived,
      onError,
      onComplete,
    );
  }

  async wsDispose() {
    this._notifiSubService.disposeClient();
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
    return this._notifiSubService.addEventListener(
      event,
      callBack,
      onError,
      onComplete,
    );
  }

  removeEventListener<T extends keyof NotifiEmitterEvents>(
    event: T,
    id: string,
  ) {
    return this._notifiSubService.removeEventListener(event, id);
  }

  async getUserSettings(
    variables: Generated.GetUserSettingsQueryVariables,
  ): Promise<Generated.GetUserSettingsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getUserSettings(variables, headers);
  }

  async logInFromDapp(
    variables: Generated.LogInFromDappMutationVariables,
  ): Promise<Generated.LogInFromDappMutation> {
    const headers = this._requestHeaders();
    const result = await this._typedClient.logInFromDapp(variables, headers);
    const token = result.logInFromDapp?.authorization?.token;
    if (token !== undefined) {
      this._onAuthComplete(token);
    }
    return result;
  }

  async logInFromService(
    variables: Generated.LogInFromServiceMutationVariables,
  ): Promise<Generated.LogInFromServiceMutation> {
    const headers = this._requestHeaders();
    const result = await this._typedClient.logInFromService(variables, headers);
    const token = result.logInFromService?.token;
    if (token !== undefined) {
      this._onAuthComplete(token);
    }
    return result;
  }

  async logInByOidc(
    variables: Generated.LogInByOidcMutationVariables,
  ): Promise<Generated.LogInByOidcMutation> {
    const headers = this._requestHeaders();
    const result = await this._typedClient.logInByOidc(variables, headers);
    const token = result.logInByOidc?.user?.authorization?.token;
    if (token !== undefined) {
      this._onAuthComplete(token);
    }
    return result;
  }

  async markFusionNotificationHistoryAsRead(
    variables: Generated.MarkFusionNotificationHistoryAsReadMutationVariables,
  ): Promise<Generated.MarkFusionNotificationHistoryAsReadMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.markFusionNotificationHistoryAsRead(
      variables,
      headers,
    );
  }

  async updateUserSettings(
    variables: Generated.UpdateUserSettingsMutationVariables,
  ): Promise<Generated.UpdateUserSettingsMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.updateUserSettings(variables, headers);
  }

  async refreshAuthorization(
    variables: Generated.RefreshAuthorizationMutationVariables,
  ): Promise<Generated.RefreshAuthorizationMutation> {
    const headers = this._requestHeaders();
    const result = await this._typedClient.refreshAuthorization(
      variables,
      headers,
    );
    const token = result.refreshAuthorization?.token;
    if (token !== undefined) {
      this._onAuthComplete(token);
    }
    return result;
  }

  async sendEmailTargetVerificationRequest(
    variables: Generated.SendEmailTargetVerificationRequestMutationVariables,
  ): Promise<Generated.SendEmailTargetVerificationRequestMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.sendEmailTargetVerificationRequest(
      variables,
      headers,
    );
  }

  async sendMessage(
    variables: Generated.SendMessageMutationVariables,
  ): Promise<Generated.SendMessageMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.sendMessage(variables, headers);
  }

  async updateTargetGroup(
    variables: Generated.UpdateTargetGroupMutationVariables,
  ): Promise<Generated.UpdateTargetGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.updateTargetGroup(variables, headers);
  }

  async beginLogInWithWeb3(
    variables: Generated.BeginLogInWithWeb3MutationVariables,
  ): Promise<Generated.BeginLogInWithWeb3Mutation> {
    const headers = this._requestHeaders();
    return this._typedClient.beginLogInWithWeb3(variables, headers);
  }

  async completeLogInWithWeb3(
    variables: Generated.CompleteLogInWithWeb3MutationVariables,
  ): Promise<Generated.CompleteLogInWithWeb3Mutation> {
    const headers = this._requestHeaders();
    const result = await this._typedClient.completeLogInWithWeb3(
      variables,
      headers,
    );
    const token = result?.completeLogInWithWeb3?.user?.authorization?.token;
    if (token !== undefined) {
      this._onAuthComplete(token);
    }
    return result;
  }

  async verifyCbwTarget(
    variables: Generated.VerifyCbwTargetMutationVariables,
  ): Promise<Generated.VerifyCbwTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.verifyCbwTarget(variables, headers);
  }

  async verifyXmtpTarget(
    variables: Generated.VerifyXmtpTargetMutationVariables,
  ): Promise<Generated.VerifyXmtpTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.verifyXmtpTarget(variables, headers);
  }

  async verifyXmtpTargetViaXip42(
    variables: Generated.VerifyXmtpTargetViaXip42MutationVariables,
  ): Promise<Generated.VerifyXmtpTargetViaXip42Mutation> {
    const headers = this._requestHeaders();
    return this._typedClient.verifyXmtpTargetViaXip42(variables, headers);
  }

  async createWebPushTarget(
    variables: Generated.CreateWebPushTargetMutationVariables,
  ): Promise<Generated.CreateWebPushTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createWebPushTarget(variables, headers);
  }

  async updateWebPushTarget(
    variables: Generated.UpdateWebPushTargetMutationVariables,
  ): Promise<Generated.UpdateWebPushTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.updateWebPushTarget(variables, headers);
  }

  async deleteWebPushTarget(
    variables: Generated.DeleteWebPushTargetMutationVariables,
  ): Promise<Generated.DeleteWebPushTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteWebPushTarget(variables, headers);
  }

  async getWebPushTargets(
    variables: Generated.GetWebPushTargetsQueryVariables,
  ): Promise<Generated.GetWebPushTargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getWebPushTargets(variables, headers);
  }

  async getSmartLinkConfig(
    variables: Generated.GetSmartLinkConfigQueryVariables,
  ): Promise<Generated.GetSmartLinkConfigQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getSmartLinkConfig(variables, headers);
  }

  private _onAuthComplete(jwt: string | undefined): void {
    this._jwt = jwt;
    this._notifiSubService.setJwt(jwt);
  }

  private _requestHeaders(): HeadersInit {
    const requestId = uuid();
    const headers: HeadersInit = {
      'X-Request-Id': requestId,
      'X-Notifi-Client-Version': version,
    };

    if (this._jwt !== undefined) {
      headers['Authorization'] = `Bearer ${this._jwt}`;
    }

    if (this._optionHeaders) {
      Object.entries(this._optionHeaders).forEach(([key, value]) => {
        /* Request ID is always set by the notifi-graphql service. */
        if (!(key === 'X-Request-Id')) {
          headers[key] = value;
        }
      });
    }

    return headers;
  }
}
