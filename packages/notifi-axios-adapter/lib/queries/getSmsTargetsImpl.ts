import { smsTargetFragment, smsTargetFragmentDependencies } from '../fragments';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
import { GetSmsTargetsResult } from '@notifi-network/notifi-core';

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
  'smsTarget',
);

export default getSmsTargetsImpl;
