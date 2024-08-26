import { gql } from 'graphql-request';

import { UserFragment } from '../fragments/UserFragment.gql';

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
