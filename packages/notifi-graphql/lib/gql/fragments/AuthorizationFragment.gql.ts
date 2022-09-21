import { gql } from 'graphql-request';

export const AuthorizationFragment = gql`
  fragment AuthorizationFragment on Authorization {
    token
    expiry
  }
`;
