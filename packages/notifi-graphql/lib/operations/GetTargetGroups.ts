import type {
  GetTargetGroupsQuery,
  GetTargetGroupsQueryVariables,
} from '../gql/generated';

export type GetTargetGroupsService = Readonly<{
  getTargetGroups: (
    variables: GetTargetGroupsQueryVariables,
  ) => Promise<GetTargetGroupsQuery>;
}>;
