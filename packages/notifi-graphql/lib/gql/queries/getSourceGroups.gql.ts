import { gql } from 'graphql-request';

import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';

export const GetSourceGroups = gql`
  query getSourceGroups {
    sourceGroup {
      ...SourceGroupFragment
    }
  }
  ${SourceGroupFragment}
`;
