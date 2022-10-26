import { gql } from 'graphql-request';

import { TenantConfigFragment } from '../fragments/TenantConfigFragment.gql';

export const FindTenantConfig = gql`
  query findTenantConfig($input: FindTenantConfigInput!) {
    findTenantConfig(findTenantConfigInput: $input) {
      ...TenantConfigFragment
    }
  }
  ${TenantConfigFragment}
`;
