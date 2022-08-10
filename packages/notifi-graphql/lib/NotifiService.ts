import type * as Generated from './gql/generated';
import { getSdk } from './gql/generated';
import type * as Operations from './operations';
import { GraphQLClient } from 'graphql-request';

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
    Operations.DeleteAlertService,
    Operations.DeleteSourceGroupService,
    Operations.DeleteTargetGroupService,
    Operations.LogInFromDappService,
    Operations.RefreshAuthorizationService,
    Operations.SendEmailTargetVerificationRequestService,
    Operations.GetAlertsService,
    Operations.UpdateSourceGroupService,
    Operations.UpdateTargetGroupService
{
  _rawClient: GraphQLClient;
  _typedClient: ReturnType<typeof getSdk>;

  constructor(graphQLClient: GraphQLClient) {
    this._rawClient = graphQLClient;
    this._typedClient = getSdk(graphQLClient);
  }

  async beginLogInByTransaction(
    variables: Generated.BeginLogInByTransactionMutationVariables,
  ): Promise<Generated.BeginLogInByTransactionMutation> {
    return this._typedClient.beginLogInByTransaction(variables);
  }

  async broadcastMessage(
    variables: Generated.BroadcastMessageMutationVariables,
  ): Promise<Generated.BroadcastMessageMutation> {
    return this._typedClient.broadcastMessage(variables);
  }

  async completeLogInByTransaction(
    variables: Generated.CompleteLogInByTransactionMutationVariables,
  ): Promise<Generated.CompleteLogInByTransactionMutation> {
    const result = await this._typedClient.completeLogInByTransaction(
      variables,
    );

    const token = result.completeLogInByTransaction?.authorization?.token;
    if (token !== undefined) {
      this._rawClient.setHeader('Authorization', `Bearer ${token}`);
    }

    return result;
  }

  async createAlert(
    variables: Generated.CreateAlertMutationVariables,
  ): Promise<Generated.CreateAlertMutation> {
    return this._typedClient.createAlert(variables);
  }

  async createEmailTarget(
    variables: Generated.CreateEmailTargetMutationVariables,
  ): Promise<Generated.CreateEmailTargetMutation> {
    return this._typedClient.createEmailTarget(variables);
  }

  async createSmsTarget(
    variables: Generated.CreateSmsTargetMutationVariables,
  ): Promise<Generated.CreateSmsTargetMutation> {
    return this._typedClient.createSmsTarget(variables);
  }

  async createSource(
    variables: Generated.CreateSourceMutationVariables,
  ): Promise<Generated.CreateSourceMutation> {
    return this._typedClient.createSource(variables);
  }

  async createSourceGroup(
    variables: Generated.CreateSourceGroupMutationVariables,
  ): Promise<Generated.CreateSourceGroupMutation> {
    return this._typedClient.createSourceGroup(variables);
  }

  async createTargetGroup(
    variables: Generated.CreateTargetGroupMutationVariables,
  ): Promise<Generated.CreateTargetGroupMutation> {
    return this._typedClient.createTargetGroup(variables);
  }

  async createTelegramTarget(
    variables: Generated.CreateTelegramTargetMutationVariables,
  ): Promise<Generated.CreateTelegramTargetMutation> {
    return this._typedClient.createTelegramTarget(variables);
  }

  async deleteAlert(
    variables: Generated.DeleteAlertMutationVariables,
  ): Promise<Generated.DeleteAlertMutation> {
    return this._typedClient.deleteAlert(variables);
  }

  async deleteSourceGroup(
    variables: Generated.DeleteSourceGroupMutationVariables,
  ): Promise<Generated.DeleteSourceGroupMutation> {
    return this._typedClient.deleteSourceGroup(variables);
  }

  async deleteTargetGroup(
    variables: Generated.DeleteTargetGroupMutationVariables,
  ): Promise<Generated.DeleteTargetGroupMutation> {
    return this._typedClient.deleteTargetGroup(variables);
  }

  async getAlerts(
    variables: Generated.GetAlertsQueryVariables,
  ): Promise<Generated.GetAlertsQuery> {
    return this._typedClient.getAlerts(variables);
  }

  async logInFromDapp(
    variables: Generated.LogInFromDappMutationVariables,
  ): Promise<Generated.LogInFromDappMutation> {
    const result = await this._typedClient.logInFromDapp(variables);

    const token = result.logInFromDapp?.authorization?.token;
    if (token !== undefined) {
      this._rawClient.setHeader('Authorization', `Bearer ${token}`);
    }

    return result;
  }

  async refreshAuthorization(
    variables: Generated.RefreshAuthorizationMutationVariables,
  ): Promise<Generated.RefreshAuthorizationMutation> {
    const result = await this._typedClient.refreshAuthorization(variables);

    const token = result.refreshAuthorization?.token;
    if (token !== undefined) {
      this._rawClient.setHeader('Authorization', `Bearer ${token}`);
    }

    return result;
  }

  async sendEmailTargetVerificationRequest(
    variables: Generated.SendEmailTargetVerificationRequestMutationVariables,
  ): Promise<Generated.SendEmailTargetVerificationRequestMutation> {
    return this._typedClient.sendEmailTargetVerificationRequest(variables);
  }

  async updateSourceGroup(
    variables: Generated.UpdateSourceGroupMutationVariables,
  ): Promise<Generated.UpdateSourceGroupMutation> {
    return this._typedClient.updateSourceGroup(variables);
  }

  async updateTargetGroup(
    variables: Generated.UpdateTargetGroupMutationVariables,
  ): Promise<Generated.UpdateTargetGroupMutation> {
    return this._typedClient.updateTargetGroup(variables);
  }
}
