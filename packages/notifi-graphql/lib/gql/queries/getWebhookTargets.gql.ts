import { gql } from 'graphql-request';

import { WebhookTargetFragment } from '../fragments/WebhookTargetFragment.gql';

export const GetWebhookTargets = gql`
  query getWebhookTargets {
    webhookTarget {
      ...WebhookTargetFragment
    }
  }
  ${WebhookTargetFragment}
`;
