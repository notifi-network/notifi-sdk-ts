import { gql } from 'graphql-request';

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
        ... on TargetLimitExceededError {
          message
        }
        ... on UnexpectedError {
          message
        }
      }
    }
  }
  ${WebPushTargetFragment}
`;
