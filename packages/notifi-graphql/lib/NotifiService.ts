import {
  GetAlertsQuery,
  GetAlertsQueryVariables,
  LogInFromDappMutation,
  LogInFromDappMutationVariables,
  getSdk,
} from './gql/generated';
import { GetAlertsService } from './operations/GetAlertsService';
import { LogInFromDappService } from './operations/LogInFromDappService';
import { GraphQLClient } from 'graphql-request';

export class NotifiService implements LogInFromDappService, GetAlertsService {
  _rawClient: GraphQLClient;
  _typedClient: ReturnType<typeof getSdk>;

  constructor(graphQLClient: GraphQLClient) {
    this._rawClient = graphQLClient;
    this._typedClient = getSdk(graphQLClient);
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
