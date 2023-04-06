import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateDiscordTargetInput,
  CreateDiscordTargetResult,
} from '@notifi-network/notifi-core';

import {
  discordTargetFragment,
  discordTargetFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [
  ...discordTargetFragmentDependencies,
  discordTargetFragment,
];

const MUTATION = `
mutation createDiscordTarget(
  $value: String!
) {
  createDiscordTarget(
    createTargetInput: {
      value: $value
    }
  ) {
    ...discordTargetFragment
  }
}
`.trim();

const createDiscordTargetImpl = makeRequest<
  CreateDiscordTargetInput,
  CreateDiscordTargetResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createDiscordTarget');

export default createDiscordTargetImpl;
