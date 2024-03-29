import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  LogInFromDappInput,
  LogInFromDappResult,
} from '@notifi-network/notifi-core';

import { userFragment, userFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...userFragmentDependencies, userFragment];

const MUTATION = `
mutation logInFromDapp(
  $walletPublicKey: String!
  $dappAddress: String!
  $timestamp: Long!
  $signature: String!
  $walletBlockchain: WalletBlockchain
  $accountId: String
) {
  logInFromDapp(dappLogInInput: {
    walletPublicKey: $walletPublicKey
    dappAddress: $dappAddress
    timestamp: $timestamp
    walletBlockchain: $walletBlockchain
    accountId: $accountId
  }, signature: $signature) {
    ...userFragment
  }
}
`.trim();

const logInFromDaoImpl = makeRequest<LogInFromDappInput, LogInFromDappResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'logInFromDapp',
);

export default logInFromDaoImpl;
