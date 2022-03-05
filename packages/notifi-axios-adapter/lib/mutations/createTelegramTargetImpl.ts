import {
  CreateTelegramTargetInput,
  CreateTelegramTargetResult
} from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeRequest } from '../utils/axiosRequest';
import {
  telegramTargetFragment,
  telegramTargetFragmentDependencies
} from '../fragments';

const DEPENDENCIES = [
  ...telegramTargetFragmentDependencies,
  telegramTargetFragment
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
