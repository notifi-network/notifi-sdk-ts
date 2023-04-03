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

const QUERY = `
query getSourceGroups {
  sourceGroup {
    ...sourceGroupFragment
  }
}
`.trim();

const getSourceGroupsImpl = makeParameterLessRequest<GetSourceGroupsResult>(
  collectDependencies(...DEPENDENCIES, QUERY),
  'sourceGroup',
);

export default getSourceGroupsImpl;
