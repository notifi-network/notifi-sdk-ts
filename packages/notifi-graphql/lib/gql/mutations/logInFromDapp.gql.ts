import { gql } from 'graphql-request';

import { UserFragment } from '../fragments/UserFragment.gql';

export const LogInFromDapp = gql`
  ${UserFragment}

  mutation logInFromDapp(
    $walletBlockchain: WalletBlockchain!
    $walletPublicKey: String!
    $dappAddress: String!
    $timestamp: Long!
    $signature: String!
    $accountId: String
  ) {
    logInFromDapp(
      dappLogInInput: {
        walletBlockchain: $walletBlockchain
        walletPublicKey: $walletPublicKey
        dappAddress: $dappAddress
        timestamp: $timestamp
        accountId: $accountId
      }
      signature: $signature
    ) {
      ...UserFragment
    }
  }
`;
