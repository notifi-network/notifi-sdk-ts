import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetDiscordTargetsResult } from '@notifi-network/notifi-core';

import {
  discordTargetFragment,
  discordTargetFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [
  ...discordTargetFragmentDependencies,
  discordTargetFragment,
];

const MUTATION = `
query getDiscordTargets {
  discordTarget {
    ...discordTargetFragment
  }
}
`.trim();

const getDiscordTargetsImpl = makeParameterLessRequest<GetDiscordTargetsResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'discordTarget',
);

export default getDiscordTargetsImpl;
