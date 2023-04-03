import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetEmailTargetsResult } from '@notifi-network/notifi-core';

import {
  emailTargetFragment,
  emailTargetFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [...emailTargetFragmentDependencies, emailTargetFragment];

const QUERY = `
query getEmailTargets {
  emailTarget {
    ...emailTargetFragment
  }
}
`.trim();

const getEmailTargetsImpl = makeParameterLessRequest<GetEmailTargetsResult>(
  collectDependencies(...DEPENDENCIES, QUERY),
  'emailTarget',
);

export default getEmailTargetsImpl;
