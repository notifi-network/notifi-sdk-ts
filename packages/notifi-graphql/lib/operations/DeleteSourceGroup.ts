import {
  DeleteSourceGroupMutation,
  DeleteSourceGroupMutationVariables,
} from '../gql/generated';

export type DeleteSourceGroupService = Readonly<{
  deleteSourceGroup: (
    variables: DeleteSourceGroupMutationVariables,
  ) => Promise<DeleteSourceGroupMutation>;
}>;
