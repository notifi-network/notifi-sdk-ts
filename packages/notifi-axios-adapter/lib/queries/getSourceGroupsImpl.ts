import {
  sourceGroupFragment,
  sourceGroupFragmentDependencies,
} from '../fragments';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
import { GetSourceGroupsResult } from '@notifi-network/notifi-core';

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
