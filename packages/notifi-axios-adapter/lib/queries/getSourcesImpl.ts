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

const MUTATION = `
query getSources {
  source {
    ...sourceFragment
  }
}
`.trim();

const getSourcesImpl = makeParameterLessRequest<GetSourcesResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'source',
);

export default getSourcesImpl;
