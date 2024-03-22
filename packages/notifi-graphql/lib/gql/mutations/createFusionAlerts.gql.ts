import { gql } from 'graphql-request';

export const CreateFusionAlerts = gql`
  mutation createFusionAlerts($input: CreateFusionAlertsInput!) {
    createFusionAlerts(input: $input) {
      alerts {
        groupName
        id
        name
        filterOptions
      }
      errors {
        ... on ArgumentError {
          __typename
          message
          paramName
        }
        ... on ArgumentNullError {
          __typename
          message
          paramName
        }
        ... on ArgumentOutOfRangeError {
          __typename
          message
          paramName
        }
      }
    }
  }
`;
