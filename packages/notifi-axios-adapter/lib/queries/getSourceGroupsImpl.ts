import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetSourceGroupsResult } from '@notifi-network/notifi-core';

import {
  sourceGroupFragment,
  sourceGroupFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [...sourceGroupFragmentDependencies, sourceGroupFragment];

const MUTATION = `
query getSourceGroups {
  sourceGroup {
    ...sourceGroupFragment
  }
}
`.trim();

const getSourceGroupsImpl = makeParameterLessRequest<GetSourceGroupsResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'sourceGroup',
);

export default getSourceGroupsImpl;
