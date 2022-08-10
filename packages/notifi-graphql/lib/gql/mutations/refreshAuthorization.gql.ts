import { gql } from 'graphql-request';

import { AuthorizationFragment } from '../fragments/AuthorizationFragment.gql';

export const RefreshAuthorization = gql`
  mutation refreshAuthorization {
    refreshAuthorization {
      ...AuthorizationFragment
    }
  }
  ${AuthorizationFragment}
`;
