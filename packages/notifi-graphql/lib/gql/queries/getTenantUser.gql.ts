import { gql } from 'graphql-request';

import { PageInfoFragment } from '../fragments/PageInfoFragment.gql';
import { TenantUserFragment } from '../fragments/TenantUserFragment.gql';

export const GetTenantConnectedWallets = gql`
  ${PageInfoFragment}
  ${TenantUserFragment}

  query getTenantUser($first: Int, $after: String) {
    tenantUser(first: $first, after: $after) {
      pageInfo {
        ...PageInfoFragment
      }
      nodes {
        ...TenantUserFragment
      }
    }
  }
`;
