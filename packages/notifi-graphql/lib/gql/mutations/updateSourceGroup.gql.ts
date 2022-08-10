import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';
import { gql } from 'graphql-request';

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
