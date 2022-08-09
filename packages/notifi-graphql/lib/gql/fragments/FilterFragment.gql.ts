import { gql } from 'graphql-request';

export const FilterFragment = gql`
  fragment FilterFragment on Filter {
    id
    name
    filterType
  }
`;
