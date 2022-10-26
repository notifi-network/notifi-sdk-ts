import type {
  FindTenantConfigQuery,
  FindTenantConfigQueryVariables,
} from '../gql/generated';

export type FindTenantConfigService = Readonly<{
  findTenantConfig: (
    variables: FindTenantConfigQueryVariables,
  ) => Promise<FindTenantConfigQuery>;
}>;
