import { gql } from 'graphql-request';

export const SlackChannelTargetFragment = gql`
  fragment SlackChannelTargetFragment on SlackChannelTarget {
    id
    name
    slackChannelName
    slackWorkspaceName
    verificationLink
    webhookVerificationLink
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
      webhookVerificationLink
      verificationStatus
    }
  }
`;

export const GetSlackChannelTargetsResponseFragment = gql`
  fragment GetSlackChannelTargetsResponseFragment on SlackChannelTargetsConnection {
    edges {
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    nodes {
      id
      name
      slackChannelName
      slackWorkspaceName
      verificationLink
      webhookVerificationLink
      verificationStatus
    }
  }
`;
