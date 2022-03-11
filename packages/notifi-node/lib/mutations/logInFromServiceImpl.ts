import type { Authorization } from '../types';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';

export type LogInFromServiceInput = Readonly<{
  input: Readonly<{
    sid: string;
    secret: string;
  }>;
}>;

export type LogInFromServiceResult = Authorization;

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation logInFromService($input: ServiceLogInInput) {
  logInFromService(serviceLogInInput: $input) {
    token
    expiry
  }
}
`.trim();

const logInFromServiceImpl = makeRequest<
  LogInFromServiceInput,
  LogInFromServiceResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'logInFromService');

export default logInFromServiceImpl;
