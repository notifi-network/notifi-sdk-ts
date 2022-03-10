import {
  emailTargetFragment,
  emailTargetFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetEmailTargetsResult } from '@notifi-network/notifi-core';

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
