import { gql } from 'graphql-request';

import { UserTopicFragment } from '../fragments/UserTopicFragment.gql';

export const GetTopics = gql`
  query getTopics {
    topics {
      nodes {
        ...UserTopicFragment
      }
    }
  }
  ${UserTopicFragment}
`;
