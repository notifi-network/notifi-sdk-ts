import { userFragment, userFragmentDependencies } from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  BeginLogInByTransactionInput,
  BeginLogInByTransactionResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [...userFragmentDependencies, userFragment];

const MUTATION = `
mutation beginLogInByTransaction(
  $walletAddress: String!
  $walletBlockchain: WalletBlockchain!
  $dappAddress: String!
) {
  beginLogInByTransaction(beginLogInByTransactionInput: {
    walletAddress: $walletAddress
    walletBlockchain: $walletBlockchain
    dappAddress: $dappAddress
  }) {
    ...userFragment
  }
}
`.trim();

const beginLogInByTransactionImpl = makeRequest<
  BeginLogInByTransactionInput,
  BeginLogInByTransactionResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'beginLogInByTransaction');

export default beginLogInByTransactionImpl;
