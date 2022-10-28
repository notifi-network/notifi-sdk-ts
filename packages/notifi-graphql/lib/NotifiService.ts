import { GraphQLClient } from 'graphql-request';
import { v4 as uuid } from 'uuid';

import type * as Generated from './gql/generated';
import { getSdk } from './gql/generated';
import type * as Operations from './operations';

export class NotifiService
  implements
    Operations.BeginLogInByTransactionService,
    Operations.BroadcastMessageService,
    Operations.CompleteLogInByTransactionService,
    Operations.CreateAlertService,
    Operations.CreateEmailTargetService,
    Operations.CreateSmsTargetService,
    Operations.CreateSourceService,
    Operations.CreateSourceGroupService,
    Operations.CreateTargetGroupService,
    Operations.CreateTelegramTargetService,
    Operations.CreateWebhookTargetService,
    Operations.DeleteAlertService,
    Operations.DeleteSourceGroupService,
    Operations.DeleteTargetGroupService,
    Operations.FindTenantConfigService,
    Operations.GetAlertsService,
    Operations.GetConfigurationForDappService,
    Operations.GetEmailTargetsService,
    Operations.GetFiltersService,
    Operations.GetNotificationHistoryService,
    Operations.GetSmsTargetsService,
    Operations.GetSourceGroupsService,
    Operations.GetSourcesService,
    Operations.GetTargetGroupsService,
    Operations.GetTelegramTargetsService,
    Operations.GetTopicsService,
    Operations.GetWebhookTargetsService,
    Operations.LogInFromDappService,
    Operations.RefreshAuthorizationService,
    Operations.SendEmailTargetVerificationRequestService,
    Operations.UpdateSourceGroupService,
    Operations.UpdateTargetGroupService
{
  private _jwt: string | undefined;
  private _typedClient: ReturnType<typeof getSdk>;

  constructor(graphQLClient: GraphQLClient) {
    this._typedClient = getSdk(graphQLClient);
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
      this._jwt = token;
    }
    return result;
  }

  async createAlert(
    variables: Generated.CreateAlertMutationVariables,
  ): Promise<Generated.CreateAlertMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createAlert(variables, headers);
  }

  async createEmailTarget(
    variables: Generated.CreateEmailTargetMutationVariables,
  ): Promise<Generated.CreateEmailTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createEmailTarget(variables, headers);
  }

  async createSmsTarget(
    variables: Generated.CreateSmsTargetMutationVariables,
  ): Promise<Generated.CreateSmsTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createSmsTarget(variables, headers);
  }

  async createSource(
    variables: Generated.CreateSourceMutationVariables,
  ): Promise<Generated.CreateSourceMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createSource(variables, headers);
  }

  async createSourceGroup(
    variables: Generated.CreateSourceGroupMutationVariables,
  ): Promise<Generated.CreateSourceGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createSourceGroup(variables, headers);
  }

  async createTargetGroup(
    variables: Generated.CreateTargetGroupMutationVariables,
  ): Promise<Generated.CreateTargetGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createTargetGroup(variables, headers);
  }

  async createWebhookTarget(
    variables: Generated.CreateWebhookTargetMutationVariables,
  ): Promise<Generated.CreateWebhookTargetMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.createWebhookTarget(variables, headers);
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

  async deleteSourceGroup(
    variables: Generated.DeleteSourceGroupMutationVariables,
  ): Promise<Generated.DeleteSourceGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteSourceGroup(variables, headers);
  }

  async deleteTargetGroup(
    variables: Generated.DeleteTargetGroupMutationVariables,
  ): Promise<Generated.DeleteTargetGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.deleteTargetGroup(variables, headers);
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

  async getConfigurationForDapp(
    variables: Generated.GetConfigurationForDappQueryVariables,
  ): Promise<Generated.GetConfigurationForDappQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getConfigurationForDapp(variables, headers);
  }

  async getEmailTargets(
    variables: Generated.GetEmailTargetsQueryVariables,
  ): Promise<Generated.GetEmailTargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getEmailTargets(variables, headers);
  }

  async getFilters(
    variables: Generated.GetFiltersQueryVariables,
  ): Promise<Generated.GetFiltersQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getFilters(variables, headers);
  }

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

  async getSourceGroups(
    variables: Generated.GetSourceGroupsQueryVariables,
  ): Promise<Generated.GetSourceGroupsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getSourceGroups(variables, headers);
  }

  async getSources(
    variables: Generated.GetSourcesQueryVariables,
  ): Promise<Generated.GetSourcesQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getSources(variables, headers);
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

  async getWebhookTargets(
    variables: Generated.GetWebhookTargetsQueryVariables,
  ): Promise<Generated.GetWebhookTargetsQuery> {
    const headers = this._requestHeaders();
    return this._typedClient.getWebhookTargets(variables, headers);
  }

  async logInFromDapp(
    variables: Generated.LogInFromDappMutationVariables,
  ): Promise<Generated.LogInFromDappMutation> {
    const headers = this._requestHeaders();
    const result = await this._typedClient.logInFromDapp(variables, headers);
    const token = result.logInFromDapp?.authorization?.token;
    if (token !== undefined) {
      this._jwt = token;
    }
    return result;
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
      this._jwt = token;
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

  async updateSourceGroup(
    variables: Generated.UpdateSourceGroupMutationVariables,
  ): Promise<Generated.UpdateSourceGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.updateSourceGroup(variables, headers);
  }

  async updateTargetGroup(
    variables: Generated.UpdateTargetGroupMutationVariables,
  ): Promise<Generated.UpdateTargetGroupMutation> {
    const headers = this._requestHeaders();
    return this._typedClient.updateTargetGroup(variables, headers);
  }

  private _requestHeaders(): HeadersInit {
    const requestId = uuid();
    const headers: HeadersInit = { 'X-Request-Id': requestId };

    if (this._jwt !== undefined) {
      headers['Authorization'] = `Bearer ${this._jwt}`;
    }

    return headers;
  }
}
