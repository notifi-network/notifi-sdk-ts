import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';
import { WebPushTargetFragment } from '../fragments/WebPushTargetFragment.gql';

export const UpdateWebPushTarget = gql`
  mutation updateWebPushTarget(
    $id: String!
    $endpoint: String!
    $auth: String!
    $p256dh: String!
  ) {
    updateWebPushTarget(
      input: { id: $id, endpoint: $endpoint, auth: $auth, p256dh: $p256dh }
    ) {
      webPushTarget {
        ...WebPushTargetFragment
      }
      errors {
        ...TargetDoesNotExistErrorFragment
        ...UnexpectedErrorFragment
      }
    }
  }
  ${WebPushTargetFragment}
  ${ErrorFragments}
`;
