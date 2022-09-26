import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  FindTenantConfigInput,
  FindTenantConfigResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES: string[] = [];

const QUERY = `
query findTenantConfig(
  $tenant: String!
  $type: TenantConfigType!
  $id: String!
) {
  findTenantConfig(findTenantConfigInput: {
    tenant: $tenant
    type: $type
    id: $id
  }) {
    id
    type
    dataJson
  }
}
`.trim();

const findTenantConfigImpl = makeRequest<
  FindTenantConfigInput,
  FindTenantConfigResult
>(collectDependencies(...DEPENDENCIES, QUERY), 'findTenantConfig');

export default findTenantConfigImpl;
