import type {
  GetTenantUserQuery,
  GetTenantUserQueryVariables,
} from '../gql/generated';

export type GetTenantUserService = Readonly<{
  getTenantUser: (
    variables: GetTenantUserQueryVariables,
  ) => Promise<GetTenantUserQuery>;
}>;
