import { FilterFragment } from './FilterFragment.gql';
import { gql } from 'graphql-request';

export const SourceFragment = gql`
  fragment SourceFragment on Source {
    id
    name
    type
    blockchainAddress
    applicableFilters {
      ...FilterFragment
    }
  }
  ${FilterFragment}
`;
