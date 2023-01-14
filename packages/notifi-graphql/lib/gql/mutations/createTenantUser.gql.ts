import { gql } from 'graphql-request';

import { TenantUserFragment } from '../fragments/TenantUserFragment.gql';

export const CreateTenantUser = gql`
  ${TenantUserFragment}

  mutation createTenantUser($input: CreateTenantUserInput!) {
    createTenantUser(createTenantUserInput: $input) {
      ...TenantUserFragment
    }
  }
`;
