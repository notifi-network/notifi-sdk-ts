import { gql } from 'graphql-request';

import { PageInfoFragment } from '../fragments/PageInfoFragment.gql';
import { ActiveAlertFragment } from '../fragments/ActiveAlertFragment.gql';

export const GetActiveAlerts = gql`
  query getActiveAlerts($first: Int, $after: String, $fusionEventId: String!) {
    activeAlerts(
      after: $after
      first: $first
      activeAlertsInput: { fusionEventId: $fusionEventId }
    ) {
      nodes {
        ...ActiveAlertFragment
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${ActiveAlertFragment}
  ${PageInfoFragment}
`;
