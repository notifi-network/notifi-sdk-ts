import { gql } from 'graphql-request';

import { ErrorFragments } from '../fragments/ErrorFragments.gql';

export const CreateFusionAlerts = gql`
  mutation createFusionAlerts($input: CreateFusionAlertsInput!) {
    createFusionAlerts(input: $input) {
      alerts {
        groupName
        id
        name
        filterOptions
        subscriptionValue
        fusionEventId
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
