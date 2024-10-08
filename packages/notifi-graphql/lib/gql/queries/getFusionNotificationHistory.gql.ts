import { gql } from 'graphql-request';

import { FusionNotificationHistoryEntryFragment } from '../fragments/FusionNotificationHistoryEntryFragment.gql';
import { PageInfoFragment } from '../fragments/PageInfoFragment.gql';

export const GetFusionNotificationHistory = gql`
  query getFusionNotificationHistory(
    $after: String
    $first: Int
    $includeHidden: Boolean
    $includeRead: Boolean
  ) {
    fusionNotificationHistory(
      after: $after
      first: $first
      includeHidden: $includeHidden
      includeRead: $includeRead
    ) {
      nodes {
        ...FusionNotificationHistoryEntryFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${PageInfoFragment}
  ${FusionNotificationHistoryEntryFragment}
`;
