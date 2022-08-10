import {
  CreateSourceGroupMutation,
  CreateSourceGroupMutationVariables,
} from '../gql/generated';

export type CreateSourceGroupService = Readonly<{
  createSourceGroup: (
    variables: CreateSourceGroupMutationVariables,
  ) => Promise<CreateSourceGroupMutation>;
}>;
