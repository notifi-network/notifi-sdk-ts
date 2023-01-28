import { gql } from 'graphql-request';

import { PageInfoFragment } from '../fragments/PageInfoFragment.gql';
import { SourceFragment } from '../fragments/SourceFragment.gql';

export const GetSourceConnection = gql`
  ${PageInfoFragment}
  ${SourceFragment}
  query getSourceConnection(
    $input: GetSourcesInput
    $first: Int
    $after: String
  ) {
    sources(getSourcesInput: $input, first: $first, after: $after) {
      pageInfo {
        ...PageInfoFragment
      }
      nodes {
        ...SourceFragment
      }
    }
  }
`;
