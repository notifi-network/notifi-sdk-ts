import { SourceGroupFragment } from '../fragments/SourceGroupFragment.gql';
import { gql } from 'graphql-request';

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
