import { gql } from 'graphql-request';

import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';

export const CreateSourceGroup = gql`
  mutation createSourceGroup($name: String!, $sourceIds: [String!]!) {
    createSourceGroup(
      sourceGroupInput: { name: $name, sourceIds: $sourceIds }
    ) {
      ...SourceGroupFragment
    }
  }
  ${SourceGroupFragment}
`;
