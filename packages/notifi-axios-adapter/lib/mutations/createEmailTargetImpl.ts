import {
  emailTargetFragment,
  emailTargetFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateEmailTargetInput,
  CreateEmailTargetResult,
} from '@notifi-network/notifi-core';

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
