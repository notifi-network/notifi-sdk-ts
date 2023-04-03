import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetTargetGroupsResult } from '@notifi-network/notifi-core';

import {
  targetGroupFragment,
  targetGroupFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [...targetGroupFragmentDependencies, targetGroupFragment];

const QUERY = `
query getTargetGroups {
  targetGroup {
    ...targetGroupFragment
  }
}
`.trim();

const getTargetGroupsImpl = makeParameterLessRequest<GetTargetGroupsResult>(
  collectDependencies(...DEPENDENCIES, QUERY),
  'targetGroup',
);

export default getTargetGroupsImpl;
