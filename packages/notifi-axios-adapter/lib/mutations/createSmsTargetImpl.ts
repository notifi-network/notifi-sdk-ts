import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateSmsTargetInput,
  CreateSmsTargetResult,
} from '@notifi-network/notifi-core';

import { smsTargetFragment, smsTargetFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...smsTargetFragmentDependencies, smsTargetFragment];

const MUTATION = `
mutation createSmsTarget(
  $name: String!
  $value: String!
) {
  createSmsTarget(
    createTargetInput: {
      name: $name
      value: $value
    }
  ) {
    ...smsTargetFragment
  }
}
`.trim();

const createSmsTargetImpl = makeRequest<
  CreateSmsTargetInput,
  CreateSmsTargetResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createSmsTarget');

export default createSmsTargetImpl;
