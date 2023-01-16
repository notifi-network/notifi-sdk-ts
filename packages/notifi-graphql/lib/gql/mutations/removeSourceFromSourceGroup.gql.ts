import { gql } from 'graphql-request';

import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';

export const removeSourceFromSourceGroup = gql`
  ${SourceGroupFragment}
  mutation removeSourceFromSourceGroup(
    $input: RemoveSourceFromSourceGroupInput!
  ) {
    removeSourceFromSourceGroup(removeSourceFromSourceGroupInput: $input) {
      ...SourceGroupFragment
    }
  }
`;
