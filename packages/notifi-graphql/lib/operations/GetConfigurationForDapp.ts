import {
  GetConfigurationForDappQuery,
  GetConfigurationForDappQueryVariables,
} from '../gql/generated';

export type GetConfigurationForDappService = Readonly<{
  getConfigurationForDapp: (
    variables: GetConfigurationForDappQueryVariables,
  ) => Promise<GetConfigurationForDappQuery>;
}>;
