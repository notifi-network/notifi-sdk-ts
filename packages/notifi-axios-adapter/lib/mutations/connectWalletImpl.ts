import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  ConnectWalletInput,
  ConnectWalletResult,
} from '@notifi-network/notifi-core';

import {
  connectedWalletFragment,
  connectedWalletFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [
  ...connectedWalletFragmentDependencies,
  connectedWalletFragment,
];

const MUTATION = `
mutation connectWallet(
  $walletPublicKey: String!
  $timestamp: Long!
  $signature: String!
  $walletBlockchain: WalletBlockchain!
  $accountId: String
  $connectWalletConflictResolutionTechnique: ConnectWalletConflictResolutionTechnique
) {
  connectWallet(connectWalletInput: {
    walletPublicKey: $walletPublicKey
    timestamp: $timestamp
    walletBlockchain: $walletBlockchain
    accountId: $accountId
    connectWalletConflictResolutionTechnique: $connectWalletConflictResolutionTechnique
  }, signature: $signature) {
    ...connectedWalletFragment
  }
}
`.trim();

const connectWalletImpl = makeRequest<ConnectWalletInput, ConnectWalletResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'connectWallet',
);

export default connectWalletImpl;
