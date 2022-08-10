import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

import type { ManagedAlert } from '../types';

export type CreateDirectPushAlertInput = Readonly<{
  input: Readonly<{
    userId: string;
    emailAddresses: ReadonlyArray<string>;
    phoneNumbers: ReadonlyArray<string>;
    telegramIds: ReadonlyArray<string>;
  }>;
}>;

export type CreateDirectPushAlertResult = ManagedAlert;

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation createDirectPushAlert($input: CreateDirectPushAlertInput!) {
  createDirectPushAlert(createDirectPushAlertInput: $input) {
    id
  }
}
`.trim();

const createDirectPushAlertImpl = makeAuthenticatedRequest<
  CreateDirectPushAlertInput,
  CreateDirectPushAlertResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createDirectPushAlert');

export default createDirectPushAlertImpl;
