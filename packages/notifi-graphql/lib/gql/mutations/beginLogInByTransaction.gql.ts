import { gql } from 'graphql-request';

export const BeginLogInByTransaction = gql`
  mutation beginLogInByTransaction(
    $walletAddress: String!
    $walletBlockchain: WalletBlockchain!
    $dappAddress: String!
  ) {
    beginLogInByTransaction(
      beginLogInByTransactionInput: {
        walletAddress: $walletAddress
        walletBlockchain: $walletBlockchain
        dappAddress: $dappAddress
      }
    ) {
      nonce
    }
  }
`;
