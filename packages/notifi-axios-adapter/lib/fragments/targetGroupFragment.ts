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
  emailTargetFragment,
  smsTargetFragment,
  telegramTargetFragment,
  discordTargetFragment,
];
