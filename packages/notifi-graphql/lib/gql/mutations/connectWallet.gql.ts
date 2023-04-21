import { gql } from 'graphql-request';

import { ConnectedWalletFragment } from '../fragments/ConnectedWalletFragment.gql';

export const ConnectWallet = gql`
  mutation connectWallet(
    $walletPublicKey: String!
    $timestamp: Long!
    $signature: String!
    $walletBlockchain: WalletBlockchain!
    $accountId: String
    $connectWalletConflictResolutionTechnique: ConnectWalletConflictResolutionTechnique
  ) {
    connectWallet(
      connectWalletInput: {
        walletPublicKey: $walletPublicKey
        timestamp: $timestamp
        walletBlockchain: $walletBlockchain
        accountId: $accountId
        connectWalletConflictResolutionTechnique: $connectWalletConflictResolutionTechnique
      }
      signature: $signature
    ) {
      ...ConnectedWalletFragment
    }
  }
  ${ConnectedWalletFragment}
`;
