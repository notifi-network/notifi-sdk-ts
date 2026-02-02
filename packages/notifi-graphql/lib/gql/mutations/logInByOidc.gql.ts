import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';
import { UserFragment } from '../fragments/UserFragment.gql';

export const LogInByOidc = gql`
  ${UserFragment}

  mutation logInByOidc(
    $dappId: String!
    $oidcProvider: OidcProvider!
    $idToken: String!
  ) {
    logInByOidc(
      input: { dappId: $dappId, oidcProvider: $oidcProvider, idToken: $idToken }
    ) {
      user {
        ...UserFragment
      }
      errors {
        ...ArgumentErrorFragment
        ...UnauthorizedAccessErrorFragment
      }
    }
  }
  ${ErrorFragments}
`;
