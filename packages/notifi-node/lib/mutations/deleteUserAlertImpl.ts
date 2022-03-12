import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

export type DeleteUserAlertInput = Readonly<{
  alertId: string;
}>;

export type DeleteUserAlertResult = Readonly<{
  id: string;
}>;

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation deleteUserAlert($alertId: String!) {
  deleteUserAlert(alertId: $alertId) {
    id
  }
}

`.trim();

const deleteUserAlertImpl = makeAuthenticatedRequest<
  DeleteUserAlertInput,
  DeleteUserAlertResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'deleteUserAlert');

export default deleteUserAlertImpl;
