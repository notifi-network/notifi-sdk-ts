import {
  UpdateSourceGroupMutation,
  UpdateSourceGroupMutationVariables,
} from '../gql/generated';

export type UpdateSourceGroupService = Readonly<{
  updateSourceGroup: (
    variables: UpdateSourceGroupMutationVariables,
  ) => Promise<UpdateSourceGroupMutation>;
}>;
