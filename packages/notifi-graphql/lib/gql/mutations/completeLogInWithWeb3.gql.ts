import { gql } from 'graphql-request';

export const CompleteLogInWithWeb3 = gql`
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
    }
  }
`;
