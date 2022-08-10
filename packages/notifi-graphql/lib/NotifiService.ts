import {
  BeginLogInByTransactionMutation,
  BeginLogInByTransactionMutationVariables,
  CompleteLogInByTransactionMutation,
  CompleteLogInByTransactionMutationVariables,
  CreateAlertMutation,
  CreateAlertMutationVariables,
  CreateEmailTargetMutation,
  CreateEmailTargetMutationVariables,
  CreateSmsTargetMutation,
  CreateSmsTargetMutationVariables,
  CreateSourceGroupMutation,
  CreateSourceGroupMutationVariables,
  CreateSourceMutation,
  CreateSourceMutationVariables,
  CreateTargetGroupMutation,
  CreateTargetGroupMutationVariables,
  CreateTelegramTargetMutation,
  CreateTelegramTargetMutationVariables,
  DeleteAlertMutation,
  DeleteAlertMutationVariables,
  DeleteSourceGroupMutation,
  DeleteSourceGroupMutationVariables,
  DeleteTargetGroupMutation,
  DeleteTargetGroupMutationVariables,
  GetAlertsQuery,
  GetAlertsQueryVariables,
  LogInFromDappMutation,
  LogInFromDappMutationVariables,
  UpdateSourceGroupMutation,
  UpdateSourceGroupMutationVariables,
  UpdateTargetGroupMutation,
  UpdateTargetGroupMutationVariables,
  getSdk,
} from './gql/generated';
import * as Operations from './operations';
import { GraphQLClient } from 'graphql-request';

export class NotifiService
  implements
    Operations.BeginLogInByTransactionService,
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
    variables: BeginLogInByTransactionMutationVariables,
  ): Promise<BeginLogInByTransactionMutation> {
    return this._typedClient.beginLogInByTransaction(variables);
  }

  async completeLogInByTransaction(
    variables: CompleteLogInByTransactionMutationVariables,
  ): Promise<CompleteLogInByTransactionMutation> {
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
    variables: CreateAlertMutationVariables,
  ): Promise<CreateAlertMutation> {
    return this._typedClient.createAlert(variables);
  }

  async createEmailTarget(
    variables: CreateEmailTargetMutationVariables,
  ): Promise<CreateEmailTargetMutation> {
    return this._typedClient.createEmailTarget(variables);
  }

  async createSmsTarget(
    variables: CreateSmsTargetMutationVariables,
  ): Promise<CreateSmsTargetMutation> {
    return this._typedClient.createSmsTarget(variables);
  }

  async createSource(
    variables: CreateSourceMutationVariables,
  ): Promise<CreateSourceMutation> {
    return this._typedClient.createSource(variables);
  }

  async createSourceGroup(
    variables: CreateSourceGroupMutationVariables,
  ): Promise<CreateSourceGroupMutation> {
    return this._typedClient.createSourceGroup(variables);
  }

  async createTargetGroup(
    variables: CreateTargetGroupMutationVariables,
  ): Promise<CreateTargetGroupMutation> {
    return this._typedClient.createTargetGroup(variables);
  }

  async createTelegramTarget(
    variables: CreateTelegramTargetMutationVariables,
  ): Promise<CreateTelegramTargetMutation> {
    return this._typedClient.createTelegramTarget(variables);
  }

  async deleteAlert(
    variables: DeleteAlertMutationVariables,
  ): Promise<DeleteAlertMutation> {
    return this._typedClient.deleteAlert(variables);
  }

  async deleteSourceGroup(
    variables: DeleteSourceGroupMutationVariables,
  ): Promise<DeleteSourceGroupMutation> {
    return this._typedClient.deleteSourceGroup(variables);
  }

  async deleteTargetGroup(
    variables: DeleteTargetGroupMutationVariables,
  ): Promise<DeleteTargetGroupMutation> {
    return this._typedClient.deleteTargetGroup(variables);
  }

  async getAlerts(variables: GetAlertsQueryVariables): Promise<GetAlertsQuery> {
    return this._typedClient.getAlerts(variables);
  }

  async logInFromDapp(
    variables: LogInFromDappMutationVariables,
  ): Promise<LogInFromDappMutation> {
    const result = await this._typedClient.logInFromDapp(variables);

    const token = result.logInFromDapp?.authorization?.token;
    if (token !== undefined) {
      this._rawClient.setHeader('Authorization', `Bearer ${token}`);
    }

    return result;
  }

  async updateSourceGroup(
    variables: UpdateSourceGroupMutationVariables,
  ): Promise<UpdateSourceGroupMutation> {
    return this._typedClient.updateSourceGroup(variables);
  }

  async updateTargetGroup(
    variables: UpdateTargetGroupMutationVariables,
  ): Promise<UpdateTargetGroupMutation> {
    return this._typedClient.updateTargetGroup(variables);
  }
}
