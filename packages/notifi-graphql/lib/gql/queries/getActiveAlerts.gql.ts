import { gql } from 'graphql-request';

import { PageInfoFragment } from '../fragments/PageInfoFragment.gql';

export const GetActiveAlerts = gql`
  query getActiveAlerts($first: Int, $after: String, $fusionEventId: String!) {
    activeAlerts(
      after: $after
      first: $first
      activeAlertsInput: { fusionEventId: $fusionEventId }
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
