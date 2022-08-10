import { TargetGroupFragment } from '../fragments/TargetGroupFragment.gql';
import { gql } from 'graphql-request';

export const CreateTargetGroup = gql`
  mutation createTargetGroup(
    $name: String!
    $emailTargetIds: [String!]!
    $smsTargetIds: [String!]!
    $telegramTargetIds: [String!]!
  ) {
    createTargetGroup(
      targetGroupInput: {
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
