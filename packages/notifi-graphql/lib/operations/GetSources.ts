import type {
  GetSourcesQuery,
  GetSourcesQueryVariables,
} from '../gql/generated';

export type GetSourcesService = Readonly<{
  getSources: (variables: GetSourcesQueryVariables) => Promise<GetSourcesQuery>;
}>;
