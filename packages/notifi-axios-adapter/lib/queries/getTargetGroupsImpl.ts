import {
  targetGroupFragment,
  targetGroupFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetTargetGroupsResult } from '@notifi-network/notifi-core';

const DEPENDENCIES = [...targetGroupFragmentDependencies, targetGroupFragment];

const MUTATION = `
query getTargetGroups {
  targetGroup {
    ...targetGroupFragment
  }
}
`.trim();

const getTargetGroupsImpl = makeParameterLessRequest<GetTargetGroupsResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'targetGroup',
);

export default getTargetGroupsImpl;
