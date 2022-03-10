import { sourceFragment, sourceFragmentDependencies } from './sourceFragment';

export const sourceGroupFragment = `
fragment sourceGroupFragment on SourceGroup {
  id
  name
  sources {
    ...sourceFragment
  }
}
`.trim();

export const sourceGroupFragmentDependencies = [
  ...sourceFragmentDependencies,
  sourceFragment,
];
