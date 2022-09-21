import { gql } from 'graphql-request';

import { UserFragment } from '../fragments/UserFragment.gql';

export const LogInFromDapp = gql`
  ${UserFragment}

  mutation logInFromDapp(
    $walletPublicKey: String!
    $dappAddress: String!
    $timestamp: Long!
    $signature: String!
    $accountId: String
  ) {
    logInFromDapp(
      dappLogInInput: {
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
