import { gql } from 'graphql-request';

import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';

export const UpdateSourceGroup = gql`
  mutation updateSourceGroup(
    $id: String!
    $name: String!
    $sourceIds: [String!]!
  ) {
    updateSourceGroup: createSourceGroup(
      sourceGroupInput: { id: $id, name: $name, sourceIds: $sourceIds }
    ) {
      ...SourceGroupFragment
    }
  }
  ${SourceGroupFragment}
`;
