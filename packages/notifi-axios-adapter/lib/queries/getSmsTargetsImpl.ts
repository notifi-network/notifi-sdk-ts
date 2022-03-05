import { GetSmsTargetsResult } from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import { smsTargetFragment, smsTargetFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...smsTargetFragmentDependencies, smsTargetFragment];

const MUTATION = `
query getSmsTargets {
  smsTarget {
    ...smsTargetFragment
  }
}
`.trim();

const getSmsTargetsImpl = makeParameterLessRequest<GetSmsTargetsResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'smsTarget'
);

export default getSmsTargetsImpl;
