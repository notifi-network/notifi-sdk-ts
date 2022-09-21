import type {
  GetSourceGroupsQuery,
  GetSourceGroupsQueryVariables,
} from '../gql/generated';

export type GetSourceGroupsService = Readonly<{
  getSourceGroups: (
    variables: GetSourceGroupsQueryVariables,
  ) => Promise<GetSourceGroupsQuery>;
}>;
