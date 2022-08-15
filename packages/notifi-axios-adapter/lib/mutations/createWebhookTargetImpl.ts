import {
  webhookTargetFragment,
  webhookTargetFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateWebhookTargetInput,
  CreateWebhookTargetResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [
  ...webhookTargetFragmentDependencies,
  webhookTargetFragment,
];

const MUTATION = `
mutation createWebhookTarget(
  $name: String!
  $url: String!
  $format: WebhookPayloadFormat!
  $headers: [KeyValuePairOfStringAndStringInput!]!
) {
  createWebhookTarget(
    createTargetInput: {
      name: $name
      url: $url
      format: $format
      headers: $headers
    }
  ) {
    ...webhookTargetFragment
  }
}
`.trim();

const createWebhookTargetImpl = makeRequest<
  CreateWebhookTargetInput,
  CreateWebhookTargetResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createWebhookTarget');

export default createWebhookTargetImpl;
