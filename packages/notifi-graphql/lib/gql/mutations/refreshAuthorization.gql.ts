import { AuthorizationFragment } from '../fragments/AuthorizationFragment.gql';
import { gql } from 'graphql-request';

export const RefreshAuthorization = gql`
  mutation refreshAuthorization {
    refreshAuthorization {
      ...AuthorizationFragment
    }
  }
  ${AuthorizationFragment}
`;
