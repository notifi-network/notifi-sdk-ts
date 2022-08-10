import {
  DeleteTargetGroupMutation,
  DeleteTargetGroupMutationVariables,
} from '../gql/generated';

export type DeleteTargetGroupService = Readonly<{
  deleteTargetGroup: (
    variables: DeleteTargetGroupMutationVariables,
  ) => Promise<DeleteTargetGroupMutation>;
}>;
