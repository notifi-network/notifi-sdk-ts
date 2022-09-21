import { gql } from 'graphql-request';

import { WebhookTargetFragment } from '../fragments/WebhookTargetFragment.gql';

export const CreateWebhookTarget = gql`
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
      ...WebhookTargetFragment
    }
  }
  ${WebhookTargetFragment}
`;
