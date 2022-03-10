import {
  targetGroupFragment,
  targetGroupFragmentDependencies,
} from '../fragments';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
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
