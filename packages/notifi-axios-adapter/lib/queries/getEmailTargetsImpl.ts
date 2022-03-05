import { GetEmailTargetsResult } from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeParameterLessRequest } from '../utils/axiosRequest';
import {
  emailTargetFragment,
  emailTargetFragmentDependencies
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
  'emailTarget'
);

export default getEmailTargetsImpl;
