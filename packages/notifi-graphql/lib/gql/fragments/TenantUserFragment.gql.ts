import { gql } from 'graphql-request';

import { TenantConnectedWalletFragment } from './TenantConnectedWalletFragment.gql';
import { TenantUserAlertFragment } from './TenantUserAlertFragment.gql';

export const TenantUserFragment = gql`
  ${TenantUserAlertFragment}
  ${TenantConnectedWalletFragment}

  fragment TenantUserFragment on TenantUser {
    id
    alerts {
      ...TenantUserAlertFragment
    }
    connectedWallets {
      ...TenantConnectedWalletFragment
    }
  }
`;
