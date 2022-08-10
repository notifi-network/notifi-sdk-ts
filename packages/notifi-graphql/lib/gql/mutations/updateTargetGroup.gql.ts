import { gql } from 'graphql-request';

import { TargetGroupFragment } from '../fragments/TargetGroupFragment.gql';

export const UpdateTargetGroup = gql`
  mutation updateTargetGroup(
    $id: String!
    $name: String!
    $emailTargetIds: [String!]!
    $smsTargetIds: [String!]!
    $telegramTargetIds: [String!]!
  ) {
    updateTargetGroup: createTargetGroup(
      targetGroupInput: {
        id: $id
        name: $name
        emailTargetIds: $emailTargetIds
        smsTargetIds: $smsTargetIds
        telegramTargetIds: $telegramTargetIds
      }
    ) {
      ...TargetGroupFragment
    }
  }
  ${TargetGroupFragment}
`;
