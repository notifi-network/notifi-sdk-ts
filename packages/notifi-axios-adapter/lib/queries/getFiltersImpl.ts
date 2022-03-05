import { GetFiltersResult } from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeParameterLessRequest } from '../utils/axiosRequest';
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
  'filter'
);

export default getFiltersImpl;
