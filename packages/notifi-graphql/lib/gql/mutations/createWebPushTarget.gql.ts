import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';
import { WebPushTargetFragment } from '../fragments/WebPushTargetFragment.gql';

export const CreateWebPushTarget = gql`
  mutation createWebPushTarget(
    $vapidPublicKey: String!
    $endpoint: String!
    $auth: String!
    $p256dh: String!
  ) {
    createWebPushTarget(
      input: {
        vapidPublicKey: $vapidPublicKey
        endpoint: $endpoint
        auth: $auth
        p256dh: $p256dh
      }
    ) {
      webPushTarget {
        ...WebPushTargetFragment
      }
      errors {
        ...TargetLimitExceededErrorFragment
        ...UnexpectedErrorFragment
      }
    }
  }
  ${WebPushTargetFragment}
  ${ErrorFragments}
`;
