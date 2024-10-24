import { gql } from 'graphql-request';

import { PageInfoFragment } from '../fragments/PageInfoFragment.gql';

export const GetActiveAlerts = gql`
  query getActiveAlerts(
    $first: Int
    $after: String
    $fusionEventIds: [String!]
  ) {
    activeAlerts(
      after: $after
      first: $first
      activeAlertsInput: { fusionEventIds: $fusionEventIds }
    ) {
      nodes {
        id
        filterOptionsJson
        fusionEventId
        subscriptionValue
        user {
          id
          connectedWallets {
            address
            walletBlockchain
          }
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${PageInfoFragment}
`;

// ...FusionNotificationHistoryEntryFragment
