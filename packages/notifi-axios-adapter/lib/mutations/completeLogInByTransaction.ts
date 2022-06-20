import { userFragment, userFragmentDependencies } from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CompleteLogInByTransactionInput,
  CompleteLogInByTransactionResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [...userFragmentDependencies, userFragment];

const MUTATION = `
mutation completeLogInByTransaction(
  $walletAddress: String!,
  $walletBlockchain: WalletBlockchain!,
  $dappAddress: String!,
  $randomUuid: String!,
  $transactionSignature: String!
) {
  completeLogInByTransaction(dappLogInInput: {
    walletPublicKey: $walletPublicKey
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
