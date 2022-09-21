import { gql } from 'graphql-request';

import { AuthorizationFragment } from './AuthorizationFragment.gql';

export const UserFragment = gql`
  fragment UserFragment on User {
    email
    emailConfirmed
    authorization {
      ...AuthorizationFragment
    }
    roles
  }
  ${AuthorizationFragment}
`;
