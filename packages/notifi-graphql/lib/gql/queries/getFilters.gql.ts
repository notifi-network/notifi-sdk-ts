import { gql } from 'graphql-request';

import { FilterFragment } from '../fragments/FilterFragment.gql';

export const GetFilters = gql`
  query getFilters {
    filter {
      ...FilterFragment
    }
  }
  ${FilterFragment}
`;
