import {
  collectDependencies,
  makeParameterLessRequest,
} from '@notifi-network/notifi-axios-utils';
import { GetWebhookTargetsResult } from '@notifi-network/notifi-core';

import {
  webhookTargetFragment,
  webhookTargetFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [
  ...webhookTargetFragmentDependencies,
  webhookTargetFragment,
];

const MUTATION = `
query getWebhookTargets {
  webhookTarget {
    ...webhookTargetFragment
  }
}
`.trim();

const getWebhookTargetsImpl = makeParameterLessRequest<GetWebhookTargetsResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'webhookTarget',
);

export default getWebhookTargetsImpl;
