import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetFiltersResult } from '@notifi-network/notifi-core';

import { filterFragment, filterFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...filterFragmentDependencies, filterFragment];

const QUERY = `
query getFilters {
  filter {
    ...filterFragment
  }
}
`.trim();

const getFiltersImpl = makeParameterLessRequest<GetFiltersResult>(
  collectDependencies(...DEPENDENCIES, QUERY),
  'filter',
);

export default getFiltersImpl;
