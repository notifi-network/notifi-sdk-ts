import { gql } from 'graphql-request';

export const WebPushTargetFragment = gql`
  fragment WebPushTargetFragment on WebPushTarget {
    id
    createdDate
    name
  }
`;
