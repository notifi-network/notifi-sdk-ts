import { UserFragment } from '../fragments/UserFragment.gql';
import { gql } from 'graphql-request';

export const LogInFromDapp = gql`
  ${UserFragment}

  mutation logInFromDapp(
    $walletPublicKey: String!
    $dappAddress: String!
    $timestamp: Long!
    $signature: String!
  ) {
    logInFromDapp(
      dappLogInInput: {
        walletPublicKey: $walletPublicKey
        dappAddress: $dappAddress
        timestamp: $timestamp
      }
      signature: $signature
    ) {
      ...UserFragment
    }
  }
`;
