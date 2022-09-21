import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

import type { ManagedAlert } from '../types';

export type DeleteDirectPushAlertInput = Readonly<{
  input: Readonly<{
    alertId: string;
  }>;
}>;

export type DeleteDirectPushAlertResult = ManagedAlert;

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation deleteDirectPushAlert($input: DeleteDirectPushAlertInput!) {
  deleteDirectPushAlert(deleteDirectPushAlertInput: $input) {
    id
  }
}
`.trim();

const deleteDirectPushAlertImpl = makeAuthenticatedRequest<
  DeleteDirectPushAlertInput,
  DeleteDirectPushAlertResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'deleteDirectPushAlert');

export default deleteDirectPushAlertImpl;
