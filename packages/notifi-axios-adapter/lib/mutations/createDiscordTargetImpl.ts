import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateEmailTargetInput,
  CreateEmailTargetResult,
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
  $name: String!
  $value: String!
) {
  createDiscordTarget(
    createTargetInput: {
      name: $name
      value: $value
    }
  ) {
    ...discordTargetFragment
  }
}
`.trim();

const createDiscordTargetImpl = makeRequest<
  CreateEmailTargetInput,
  CreateEmailTargetResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createDiscordTarget');

export default createDiscordTargetImpl;
