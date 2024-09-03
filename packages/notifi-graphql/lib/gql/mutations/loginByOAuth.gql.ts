import { gql } from 'graphql-request';

import { UserFragment } from '../fragments/UserFragment.gql';

// TODO: Remove after Oidc migration
export const LogInByOAuth = gql`
  ${UserFragment}

  mutation logInByOAuth(
    $dappId: String!
    $oAuthIssuer: OAuthIssuer!
    $token: String!
  ) {
    logInByOAuth(
      logInByOAuthInput: {
        dappId: $dappId
        oAuthIssuer: $oAuthIssuer
        token: $token
      }
    ) {
      ...UserFragment
    }
  }
`;
