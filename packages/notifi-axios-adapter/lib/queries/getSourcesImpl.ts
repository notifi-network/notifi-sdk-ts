import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetSourcesResult } from '@notifi-network/notifi-core';

import {
  sourceFragment,
  sourceFragmentDependencies,
} from '../fragments/sourceFragment';

const DEPENDENCIES = [...sourceFragmentDependencies, sourceFragment];

const QUERY = `
query getSources {
  source {
    ...sourceFragment
  }
}
`.trim();

const getSourcesImpl = makeParameterLessRequest<GetSourcesResult>(
  collectDependencies(...DEPENDENCIES, QUERY),
  'source',
);

export default getSourcesImpl;
