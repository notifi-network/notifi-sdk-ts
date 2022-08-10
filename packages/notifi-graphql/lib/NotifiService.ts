import {
  BeginLogInByTransactionMutation,
  BeginLogInByTransactionMutationVariables,
  CompleteLogInByTransactionMutation,
  CompleteLogInByTransactionMutationVariables,
  GetAlertsQuery,
  GetAlertsQueryVariables,
  LogInFromDappMutation,
  LogInFromDappMutationVariables,
  getSdk,
} from './gql/generated';
import {
  BeginLogInByTransactionService,
  CompleteLogInByTransactionService,
  GetAlertsService,
  LogInFromDappService,
} from './operations';
import { GraphQLClient } from 'graphql-request';

export class NotifiService
  implements
    BeginLogInByTransactionService,
    CompleteLogInByTransactionService,
    LogInFromDappService,
    GetAlertsService
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
    return this._typedClient.completeLogInByTransaction(variables);
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
}
