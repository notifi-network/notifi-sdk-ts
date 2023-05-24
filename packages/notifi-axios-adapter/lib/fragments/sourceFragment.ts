import { filterFragment, filterFragmentDependencies } from './filterFragment';

export const sourceFragment = `
fragment sourceFragment on Source {
  id
  name
  type
  fusionEventTypeId
  blockchainAddress
  applicableFilters {
    ...filterFragment
  }
}
`.trim();

export const sourceFragmentDependencies = [
  ...filterFragmentDependencies,
  filterFragment,
];
