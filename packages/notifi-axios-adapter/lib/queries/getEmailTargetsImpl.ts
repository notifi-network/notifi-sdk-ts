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

const MUTATION = `
query getEmailTargets {
  emailTarget {
    ...emailTargetFragment
  }
}
`.trim();

const getEmailTargetsImpl = makeParameterLessRequest<GetEmailTargetsResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'emailTarget',
);

export default getEmailTargetsImpl;
