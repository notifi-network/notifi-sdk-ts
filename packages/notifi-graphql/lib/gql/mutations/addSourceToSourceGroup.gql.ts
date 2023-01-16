import { gql } from 'graphql-request';

import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';

export const AddSourceToSourceGroup = gql`
  ${SourceGroupFragment}
  mutation addSourceToSourceGroup($input: AddSourceToSourceGroupInput!) {
    addSourceToSourceGroup(addSourceToSourceGroupInput: $input) {
      ...SourceGroupFragment
    }
  }
`;
