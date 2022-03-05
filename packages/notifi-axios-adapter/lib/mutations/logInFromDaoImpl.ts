import {
  LogInFromDaoInput,
  LogInFromDaoResult
} from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeRequest } from '../utils/axiosRequest';
import { userFragment, userFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...userFragmentDependencies, userFragment];

const MUTATION = `
mutation logInFromDao(
  $walletPublicKey: String!
  $daoAddress: String!
  $timestamp: Long!
  $signature: String!
) {
  logInFromDao(daoLogInInput: {
    walletPublicKey: $walletPublicKey
    daoAddress: $daoAddress
    timestamp: $timestamp
  }, signature: $signature) {
    ...userFragment
  }
}
`.trim();

const logInFromDaoImpl = makeRequest<LogInFromDaoInput, LogInFromDaoResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'logInFromDao'
);

export default logInFromDaoImpl;
