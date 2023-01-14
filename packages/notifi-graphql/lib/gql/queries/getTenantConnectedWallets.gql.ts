import { gql } from 'graphql-request';

import { PageInfoFragment } from '../fragments/PageInfoFragment.gql';
import { TenantConnectedWalletFragment } from '../fragments/TenantConnectedWalletFragment.gql';
import { TenantUserFragment } from '../fragments/TenantUserFragment.gql';

export const GetTenantConnectedWallets = gql`
  ${PageInfoFragment}
  ${TenantConnectedWalletFragment}
  ${TenantUserFragment}

  query getTenantConnectedWallet(
    $input: GetTenantConnectedWalletInput
    $first: Int
    $after: String
  ) {
    tenantConnectedWallet(
      getTenantConnectedWalletInput: $input
      first: $first
      after: $after
    ) {
      pageInfo {
        ...PageInfoFragment
      }
      nodes {
        ...TenantConnectedWalletFragment
        user {
          ...TenantUserFragment
        }
      }
    }
  }
`;
