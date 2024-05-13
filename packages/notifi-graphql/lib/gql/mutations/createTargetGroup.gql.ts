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
    $slackChannelTargetIds: [String!]!
    $web3TargetIds: [String!]!
  ) {
    createTargetGroup(
      targetGroupInput: {
        name: $name
        emailTargetIds: $emailTargetIds
        smsTargetIds: $smsTargetIds
        telegramTargetIds: $telegramTargetIds
        webhookTargetIds: $webhookTargetIds
        discordTargetIds: $discordTargetIds
        slackChannelTargetIds: $slackChannelTargetIds
        web3TargetIds: $web3TargetIds
      }
    ) {
      ...TargetGroupFragment
    }
  }
  ${TargetGroupFragment}
`;
