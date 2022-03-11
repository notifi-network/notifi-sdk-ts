import { filterFragment, filterFragmentDependencies } from '../fragments';
import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetFiltersResult } from '@notifi-network/notifi-core';

const DEPENDENCIES = [...filterFragmentDependencies, filterFragment];

const MUTATION = `
query getFilters {
  filter {
    ...filterFragment
  }
}
`.trim();

const getFiltersImpl = makeParameterLessRequest<GetFiltersResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'filter',
);

export default getFiltersImpl;
