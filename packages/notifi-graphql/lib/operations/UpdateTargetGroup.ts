import {
  UpdateTargetGroupMutation,
  UpdateTargetGroupMutationVariables,
} from '../gql/generated';

export type UpdateTargetGroupService = Readonly<{
  updateTargetGroup: (
    variables: UpdateTargetGroupMutationVariables,
  ) => Promise<UpdateTargetGroupMutation>;
}>;
