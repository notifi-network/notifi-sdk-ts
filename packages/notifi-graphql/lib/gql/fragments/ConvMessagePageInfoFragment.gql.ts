import { gql } from 'graphql-request';

export const ConvMessagePageInfoFragment = gql`
  fragment ConvMessagePageInfo on PageInfo {
    hasNextPage
    endCursor
  }
`;
