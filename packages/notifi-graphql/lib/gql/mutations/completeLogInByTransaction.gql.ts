import { gql } from 'graphql-request';

import { UserFragment } from '../fragments/UserFragment.gql';

export const CompleteLogInByTransaction = gql`
  mutation completeLogInByTransaction(
    $walletAddress: String!
    $walletBlockchain: WalletBlockchain!
    $dappAddress: String!
    $randomUuid: String!
    $transactionSignature: String!
  ) {
    completeLogInByTransaction(
      completeLogInByTransactionInput: {
        walletAddress: $walletAddress
        walletBlockchain: $walletBlockchain
        dappAddress: $dappAddress
        randomUuid: $randomUuid
        transactionSignature: $transactionSignature
      }
    ) {
      ...UserFragment
    }
  }
  ${UserFragment}
`;
