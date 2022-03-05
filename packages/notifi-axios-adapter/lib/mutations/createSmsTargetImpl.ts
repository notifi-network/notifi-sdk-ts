import {
  CreateSmsTargetInput,
  CreateSmsTargetResult
} from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeRequest } from '../utils/axiosRequest';
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
