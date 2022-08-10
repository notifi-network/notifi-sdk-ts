import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CompleteLogInByTransactionInput,
  CompleteLogInByTransactionResult,
} from '@notifi-network/notifi-core';

import { userFragment, userFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...userFragmentDependencies, userFragment];

const MUTATION = `
mutation completeLogInByTransaction(
  $walletAddress: String!,
  $walletBlockchain: WalletBlockchain!,
  $dappAddress: String!,
  $randomUuid: String!,
  $transactionSignature: String!
) {
  completeLogInByTransaction(completeLogInByTransactionInput: {
    walletAddress: $walletAddress
    walletBlockchain: $walletBlockchain
    dappAddress: $dappAddress
    randomUuid: $randomUuid
    transactionSignature: $transactionSignature
  }) {
    ...userFragment
  }
}
`.trim();

const completeLogInByTransactionImpl = makeRequest<
  CompleteLogInByTransactionInput,
  CompleteLogInByTransactionResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'completeLogInByTransaction');

export default completeLogInByTransactionImpl;
