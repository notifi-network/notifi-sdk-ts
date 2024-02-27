import { gql } from 'graphql-request';

import { GetSlackChannelTargetsResponseFragment } from '../fragments/SlackTargetFragment.gql';

export const GetSlackChannelTargets = gql`
  query getSlackChannelTargets($after: String, $first: Int, $ids: [String!]!) {
    slackChannelTargets(input: { after: $after, first: $first, ids: $ids }) {
      ...GetSlackChannelTargetsResponseFragment
    }
  }
  ${GetSlackChannelTargetsResponseFragment}
`;
