import { gql } from 'graphql-request';

import { SourceFragment } from './SourceFragment.gql';

export const SourceGroupFragment = gql`
  fragment SourceGroupFragment on SourceGroup {
    id
    name
    sources {
      ...SourceFragment
    }
  }
  ${SourceFragment}
`;
