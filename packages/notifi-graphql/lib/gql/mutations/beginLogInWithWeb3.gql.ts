import { gql } from 'graphql-request';

export const BeginLogInWithWeb3 = gql`
mutation beginLogInWithWeb3(
  $authAddress: String!
  $blockchainType: WalletBlockchain!
  $dappAddress: String!
  $authType: Web3AuthType!
  $walletPubkey: String
) {
  beginLogInWithWeb3(beginLogInWithWeb3Input: {
    authAddress: $authAddress
    blockchainType: $blockchainType
    dappAddress: $dappAddress
    authType: $authType
    walletPubkey: $walletPubkey
  }) {
    beginLogInWithWeb3Response {
      nonce
  }
}
}
`
