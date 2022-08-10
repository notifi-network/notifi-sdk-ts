import {
  CreateTargetGroupMutation,
  CreateTargetGroupMutationVariables,
} from '../gql/generated';

export type CreateTargetGroupService = Readonly<{
  createTargetGroup: (
    variables: CreateTargetGroupMutationVariables,
  ) => Promise<CreateTargetGroupMutation>;
}>;
