import { SourceFragment } from '../fragments/SourceFragment.gql';
import { gql } from 'graphql-request';

export const CreateSource = gql`
  mutation createSource(
    $name: String!
    $blockchainAddress: String!
    $type: SourceType!
  ) {
    createSource(
      createSourceInput: {
        name: $name
        blockchainAddress: $blockchainAddress
        type: $type
      }
    ) {
      ...SourceFragment
    }
  }
  ${SourceFragment}
`;
