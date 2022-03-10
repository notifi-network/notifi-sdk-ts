import { filterFragment, filterFragmentDependencies } from '../fragments';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
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
