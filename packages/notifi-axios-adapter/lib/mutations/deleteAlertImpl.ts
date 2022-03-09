import {
  DeleteAlertInput,
  DeleteAlertResult
} from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeRequest } from '../utils/axiosRequest';

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
  'deleteAlert'
);

export default deleteAlertImpl;
