import { filterFragment, filterFragmentDependencies } from './filterFragment';
import {
  sourceGroupFragment,
  sourceGroupFragmentDependencies,
} from './sourceGroupFragment';
import {
  targetGroupFragment,
  targetGroupFragmentDependencies,
} from './targetGroupFragment';

export const alertFragment = `
fragment alertFragment on Alert {
  id
  groupName
  name
  filterOptions
  filter {
    ...filterFragment
  }
  sourceGroup {
    ...sourceGroupFragment
  }
  targetGroup {
    ...targetGroupFragment
  }
}
`.trim();

export const alertFragmentDependencies = [
  ...sourceGroupFragmentDependencies,
  ...filterFragmentDependencies,
  ...targetGroupFragmentDependencies,
  sourceGroupFragment,
  filterFragment,
  targetGroupFragment,
];
