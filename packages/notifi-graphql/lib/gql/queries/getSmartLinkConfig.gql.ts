import { gql } from 'graphql-request';

export const fetchData = gql`
  query getSmartLinkConfig($input: GetSmartLinkConfigInput!) {
    smartLinkConfig(input: $input) {
      isActive
      smartLinkConfig
    }
  }
`;
