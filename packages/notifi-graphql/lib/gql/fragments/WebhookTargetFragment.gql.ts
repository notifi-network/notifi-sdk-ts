import { gql } from 'graphql-request';

export const WebhookTargetFragment = gql`
  fragment WebhookTargetFragment on WebhookTarget {
    id
    url
    status
    format
    headers {
      key
      value
    }
    name
  }
`;
