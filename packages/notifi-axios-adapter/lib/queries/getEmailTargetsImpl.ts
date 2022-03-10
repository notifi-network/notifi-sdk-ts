import {
  emailTargetFragment,
  emailTargetFragmentDependencies,
} from '../fragments';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
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
