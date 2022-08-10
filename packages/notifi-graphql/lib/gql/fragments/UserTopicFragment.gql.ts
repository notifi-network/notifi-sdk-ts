import { gql } from 'graphql-request';

export const UserTopicFragment = gql`
  fragment UserTopicFragment on UserTopic {
    name
    topicName
    targetCollections
    targetTemplate
  }
`;
