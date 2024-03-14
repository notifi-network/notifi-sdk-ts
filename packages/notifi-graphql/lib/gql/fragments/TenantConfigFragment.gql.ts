import { gql } from 'graphql-request';

export const TenantConfigFragment = gql`
  fragment TenantConfigFragment on TenantConfig {
    id
    type
    dataJson
    fusionEvents {
      id
      metadata
      name
    }
  }
`;
