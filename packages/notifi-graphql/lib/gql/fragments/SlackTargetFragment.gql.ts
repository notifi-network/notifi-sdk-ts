import { gql } from 'graphql-request';

export const SlackChannelTargetFragment = gql`
  fragment SlackChannelTargetFragment on SlackChannelTarget {
    id
    name
    slackChannelName
    slackWorkspaceName
    verificationLink
    verificationStatus
  }
`;

export const CreateSlackChannelTargetResponseFragment = gql`
  fragment CreateSlackChannelTargetResponseFragment on CreateSlackChannelTargetResponse {
    slackChannelTarget {
      id
      name
      slackChannelName
      slackWorkspaceName
      verificationLink
      verificationStatus
    }
  }
`;

export const GetSlackChannelTargetsResponseFragment = gql`
  fragment GetSlackChannelTargetsResponseFragment on GetSlackChannelTargetsResponse {
    slackChannelTargets {
      id
      name
      slackChannelName
      slackWorkspaceName
      verificationLink
      verificationStatus
    }
  }
`;
