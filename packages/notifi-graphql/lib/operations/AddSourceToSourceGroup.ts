import {
  AddSourceToSourceGroupMutation,
  AddSourceToSourceGroupMutationVariables,
} from '../gql/generated';

export type AddSourceToSourceGroupService = Readonly<{
  addSourceToSourceGroup: (
    variables: AddSourceToSourceGroupMutationVariables,
  ) => Promise<AddSourceToSourceGroupMutation>;
}>;
