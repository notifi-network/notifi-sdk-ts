import { userFragment, userFragmentDependencies } from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  LogInFromDappInput,
  LogInFromDappResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [...userFragmentDependencies, userFragment];

const MUTATION = `
mutation logInFromDapp(
  $walletPublicKey: String!
  $dappAddress: String!
  $timestamp: Long!
  $signature: String!
) {
  logInFromDapp(dappLogInInput: {
    walletPublicKey: $walletPublicKey
    dappAddress: $dappAddress
    timestamp: $timestamp
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
