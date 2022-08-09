import { SourceFragment } from './SourceFragment.gql';
import { gql } from 'graphql-request';

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
