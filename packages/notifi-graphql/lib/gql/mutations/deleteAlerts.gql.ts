import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';

export const DeleteAlerts = gql`
  mutation deleteAlerts($input: DeleteAlertsInput!) {
    deleteAlerts(input: $input) {
      deleteAlertsResponse {
        alertsIds
      }
      errors {
        ...ArgumentErrorFragment
        ...ArgumentNullErrorFragment
        ...ArgumentOutOfRangeErrorFragment
      }
    }
  }
  ${ErrorFragments}
`;
