import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

import type { Connection, TenantUser } from '../types';

export type GetTenantUserInput = Readonly<{
  first?: number;
  after?: string;
}>;

export type GetTenantUserResult = Connection<TenantUser>;

const DEPENDENCIES: string[] = [];

const MUTATION = `
query getTenantUser(
  $first: Int
  $after: String
) {
  tenantUser(
    first: $first
  	after: $after
  ) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      alerts {
        id
        name
        groupName
        filter {
          id
          name
          filterType
        }
        filterOptions
        sourceGroup {
          id
          name
          sources {
            id
            name
            type
            blockchainAddress
          }
        }
      }
      connectedWallets {
        address
        walletBlockchain
      }
    }
  }
}
`.trim();

const getTenantUserImpl = makeAuthenticatedRequest<
  GetTenantUserInput,
  GetTenantUserResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'tenantUser');

export default getTenantUserImpl;
