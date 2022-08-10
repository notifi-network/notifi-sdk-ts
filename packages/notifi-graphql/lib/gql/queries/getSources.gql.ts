import { gql } from 'graphql-request';

import { SourceFragment } from '../fragments/SourceFragment.gql';

export const GetSources = gql`
  query getSources {
    source {
      ...SourceFragment
    }
  }
  ${SourceFragment}
`;
