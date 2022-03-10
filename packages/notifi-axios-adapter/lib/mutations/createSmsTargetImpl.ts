import { smsTargetFragment, smsTargetFragmentDependencies } from '../fragments';
import { makeRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
import {
  CreateSmsTargetInput,
  CreateSmsTargetResult,
} from '@notifi-network/notifi-core';

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
