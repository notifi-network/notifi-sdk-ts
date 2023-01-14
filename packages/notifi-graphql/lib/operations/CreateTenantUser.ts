import {
  CreateTenantUserMutation,
  CreateTenantUserMutationVariables,
} from '../gql/generated';

export type CreateTenantUserService = Readonly<{
  createTenantUser: (
    variables: CreateTenantUserMutationVariables,
  ) => Promise<CreateTenantUserMutation>;
}>;
