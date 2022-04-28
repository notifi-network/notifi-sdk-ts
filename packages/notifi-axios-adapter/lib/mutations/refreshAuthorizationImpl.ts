import {
  authorizationFragment,
  authorizationFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { RefreshAuthorizationResult } from '@notifi-network/notifi-core';

const DEPENDENCIES = [
  ...authorizationFragmentDependencies,
  authorizationFragment,
];

const MUTATION = `
mutation refreshAuthorization {
  refreshAuthorization {
    ...authorizationFragment
  }
}
`.trim();

const refreshAuthorizationImpl =
  makeParameterLessRequest<RefreshAuthorizationResult>(
    collectDependencies(...DEPENDENCIES, MUTATION),
    'refreshAuthorization',
  );

export default refreshAuthorizationImpl;
