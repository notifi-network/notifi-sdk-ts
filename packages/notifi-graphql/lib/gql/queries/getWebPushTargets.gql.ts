import { gql } from 'graphql-request';

import { WebPushTargetFragment } from '../fragments/WebPushTargetFragment.gql';

export const GetWebPushTargets = gql`
  query getWebPushTargets($ids: [String!], $first: Int, $after: String) {
    webPushTargets(
      input: { ids: $ids, first: $first, after: $after }
      first: $first
      after: $after
    ) {
      pageInfo {
        ...PageInfoFragment
      }
      nodes {
        ...WebPushTargetFragment
      }
      edges {
        cursor
        node {
          ...WebPushTargetFragment
        }
      }
    }
  }
  ${WebPushTargetFragment}
`;
