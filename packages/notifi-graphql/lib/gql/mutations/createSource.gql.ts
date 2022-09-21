import { gql } from 'graphql-request';

import { SourceFragment } from '../fragments/SourceFragment.gql';

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
