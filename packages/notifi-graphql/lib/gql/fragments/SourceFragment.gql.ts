import { gql } from 'graphql-request';

import { FilterFragment } from './FilterFragment.gql';

export const SourceFragment = gql`
  fragment SourceFragment on Source {
    id
    name
    type
    blockchainAddress
    fusionEventTypeId
    applicableFilters {
      ...FilterFragment
    }
  }
  ${FilterFragment}
`;
