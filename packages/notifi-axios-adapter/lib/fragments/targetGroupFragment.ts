import {
  emailTargetFragment,
  emailTargetFragmentDependencies
} from './emailTargetFragment';
import {
  smsTargetFragment,
  smsTargetFragmentDependencies
} from './smsTargetFragment';
import {
  telegramTargetFragment,
  telegramTargetFragmentDependencies
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
}
`.trim();

export const targetGroupFragmentDependencies = [
  ...emailTargetFragmentDependencies,
  ...smsTargetFragmentDependencies,
  ...telegramTargetFragmentDependencies,
  emailTargetFragment,
  smsTargetFragment,
  telegramTargetFragment
];
