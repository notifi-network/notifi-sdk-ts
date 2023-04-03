import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetSmsTargetsResult } from '@notifi-network/notifi-core';

import { smsTargetFragment, smsTargetFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...smsTargetFragmentDependencies, smsTargetFragment];

const QUERY = `
query getSmsTargets {
  smsTarget {
    ...smsTargetFragment
  }
}
`.trim();

const getSmsTargetsImpl = makeParameterLessRequest<GetSmsTargetsResult>(
  collectDependencies(...DEPENDENCIES, QUERY),
  'smsTarget',
);

export default getSmsTargetsImpl;
