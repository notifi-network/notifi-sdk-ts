import type {
  GetWeb3TargetsQuery,
  GetWeb3TargetsQueryVariables,
} from '../gql/generated';

export type GetWeb3TargetsService = Readonly<{
  getWeb3Targets: (
    variables: GetWeb3TargetsQueryVariables,
  ) => Promise<GetWeb3TargetsQuery>;
}>;
