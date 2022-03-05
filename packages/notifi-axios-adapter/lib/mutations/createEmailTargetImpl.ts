import {
  CreateEmailTargetInput,
  CreateEmailTargetResult
} from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeRequest } from '../utils/axiosRequest';
import {
  emailTargetFragment,
  emailTargetFragmentDependencies
} from '../fragments';

const DEPENDENCIES = [...emailTargetFragmentDependencies, emailTargetFragment];

const MUTATION = `
mutation createEmailTarget(
  $name: String!
  $value: String!
) {
  createEmailTarget(
    createTargetInput: {
      name: $name
      value: $value
    }
  ) {
    ...emailTargetFragment
  }
}
`.trim();

const createEmailTargetImpl = makeRequest<
  CreateEmailTargetInput,
  CreateEmailTargetResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createEmailTarget');

export default createEmailTargetImpl;
