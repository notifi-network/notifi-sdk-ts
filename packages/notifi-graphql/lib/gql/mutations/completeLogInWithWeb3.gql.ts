import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';
import { UserFragment } from '../fragments/UserFragment.gql';

export const CompleteLogInWithWeb3 = gql`
  ${UserFragment}

  mutation completeLogInWithWeb3(
    $nonce: String!
    $signature: String!
    $signedMessage: String!
    $signingAddress: String!
    $signingPubkey: String!
  ) {
    completeLogInWithWeb3(
      completeLogInWithWeb3Input: {
        nonce: $nonce
        signature: $signature
        signedMessage: $signedMessage
        signingAddress: $signingAddress
        signingPubkey: $signingPubkey
      }
    ) {
      user {
        ...UserFragment
      }
      errors {
        ...ArgumentErrorFragment
      }
    }
  }
  ${ErrorFragments}
`;
