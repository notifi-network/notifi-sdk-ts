import { gql } from 'graphql-request';

import { TargetGroupFragment } from '../fragments/TargetGroupFragment.gql';

export const CreateTargetGroup = gql`
  mutation createTargetGroup(
    $name: String!
    $emailTargetIds: [String!]!
    $smsTargetIds: [String!]!
    $telegramTargetIds: [String!]!
    $webhookTargetIds: [String!]!
    $discordTargetIds: [String!]!
  ) {
    createTargetGroup(
      targetGroupInput: {
        name: $name
        emailTargetIds: $emailTargetIds
        smsTargetIds: $smsTargetIds
        telegramTargetIds: $telegramTargetIds
        webhookTargetIds: $webhookTargetIds
        discordTargetIds: $discordTargetIds
      }
    ) {
      ...TargetGroupFragment
    }
  }
  ${TargetGroupFragment}
`;
