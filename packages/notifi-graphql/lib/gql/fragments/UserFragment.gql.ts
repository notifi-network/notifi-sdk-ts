import { AuthorizationFragment } from './AuthorizationFragment.gql';
import { gql } from 'graphql-request';

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
