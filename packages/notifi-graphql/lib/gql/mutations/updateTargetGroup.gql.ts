import { TargetGroupFragment } from '../fragments/TargetGroupFragment.gql';
import { gql } from 'graphql-request';

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
