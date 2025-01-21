import { gql } from 'graphql-request';

export const DeleteAlerts = gql`
  mutation deleteAlerts($input: DeleteAlertsInput!) {
    deleteAlerts(input: $input) {
      deleteAlertsResponse {
        alertsIds
      }
      errors {
        ... on ArgumentError {
          message
          paramName
        }
        ... on ArgumentNullError {
          message
          paramName
        }
        ... on ArgumentOutOfRangeError {
          message
          paramName
        }
      }
    }
  }
`;
