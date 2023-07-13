import {
  discordTargetFragment,
  discordTargetFragmentDependencies,
} from './discordTargetFragment';
import {
  emailTargetFragment,
  emailTargetFragmentDependencies,
} from './emailTargetFragment';
import {
  smsTargetFragment,
  smsTargetFragmentDependencies,
} from './smsTargetFragment';
import {
  telegramTargetFragment,
  telegramTargetFragmentDependencies,
} from './telegramTargetFragment';
import {
  web3TargetFragment,
  web3TargetFragmentDependencies,
} from './web3TargetFragment';

export const targetGroupFragment = `
fragment targetGroupFragment on TargetGroup {
  id
  name
  emailTargets {
    ...emailTargetFragment
  }
  smsTargets {
    ...smsTargetFragment
  }
  telegramTargets {
    ...telegramTargetFragment
  }
  web3Targets {
    ...web3TargetFragment
  }
  discordTargets {
    ...discordTargetFragment
  }
}
`.trim();

export const targetGroupFragmentDependencies = [
  ...emailTargetFragmentDependencies,
  ...smsTargetFragmentDependencies,
  ...telegramTargetFragmentDependencies,
  ...discordTargetFragmentDependencies,
  ...web3TargetFragmentDependencies,
  web3TargetFragment,
  emailTargetFragment,
  smsTargetFragment,
  telegramTargetFragment,
  discordTargetFragment,
];
