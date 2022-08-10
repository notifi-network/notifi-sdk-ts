import { gql } from 'graphql-request';

import { AlertFragment } from '../fragments/AlertFragment.gql';

export const CreateAlert = gql`
  mutation createAlert(
    $name: String!
    $sourceGroupId: String!
    $filterId: String!
    $targetGroupId: String!
    $filterOptions: String!
    $groupName: String!
  ) {
    createAlert(
      alertInput: {
        name: $name
        sourceGroupId: $sourceGroupId
        filterId: $filterId
        targetGroupId: $targetGroupId
        filterOptions: $filterOptions
        groupName: $groupName
      }
    ) {
      ...AlertFragment
    }
    ${AlertFragment}
  }
`;
