import type {
  GetSourceConnectionQuery,
  GetSourceConnectionQueryVariables,
} from '../gql/generated';

export type GetSourceConnectionService = Readonly<{
  getSourceConnection: (
    variables: GetSourceConnectionQueryVariables,
  ) => Promise<GetSourceConnectionQuery>;
}>;
