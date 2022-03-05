import {
  targetGroupFragment,
  targetGroupFragmentDependencies
} from './targetGroupFragment';

export const alertFragment = `
fragment alertFragment on Alert {
  id
  name
  filter {
    id
    name
  }
  sourceGroup {
    id
    name
  }
  targetGroup {
    ...targetGroupFragment
  }
}
`.trim();

export const alertFragmentDependencies = [
  ...targetGroupFragmentDependencies,
  targetGroupFragment
];
