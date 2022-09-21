import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetFiltersResult } from '@notifi-network/notifi-core';

import { filterFragment, filterFragmentDependencies } from '../fragments';

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
