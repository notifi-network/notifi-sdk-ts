import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  DeleteAlertInput,
  DeleteAlertResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation deleteAlert(
  $id: String!
) {
  deleteAlert(alertId: $id) {
    id
  }
}
`.trim();

const deleteAlertImpl = makeRequest<DeleteAlertInput, DeleteAlertResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'deleteAlert',
);

export default deleteAlertImpl;
