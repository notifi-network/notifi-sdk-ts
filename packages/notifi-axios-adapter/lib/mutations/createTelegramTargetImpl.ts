import {
  telegramTargetFragment,
  telegramTargetFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateTelegramTargetInput,
  CreateTelegramTargetResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [
  ...telegramTargetFragmentDependencies,
  telegramTargetFragment,
];

const MUTATION = `
mutation createTelegramTarget(
  $name: String!
  $value: String!
) {
  createTelegramTarget(
    createTargetInput: {
      name: $name
      value: $value
    }
  ) {
    ...telegramTargetFragment
  }
}
`.trim();

const createTelegramTargetImpl = makeRequest<
  CreateTelegramTargetInput,
  CreateTelegramTargetResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createTelegramTarget');

export default createTelegramTargetImpl;
