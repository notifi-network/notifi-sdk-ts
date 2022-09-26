import { gql } from 'graphql-request';

export const PageInfoFragment = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    endCursor
  }
`;
