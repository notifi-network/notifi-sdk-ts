import { gql } from 'graphql-request';

import { SourceFragment } from '../fragments/SourceFragment.gql';

export const CreateSource = gql`
  mutation createSource(
    $name: String
    $blockchainAddress: String!
    $type: SourceType!
    $fusionEventTypeId: String
  ) {
    createSource(
      createSourceInput: {
        name: $name
        blockchainAddress: $blockchainAddress
        type: $type
        fusionEventTypeId: $fusionEventTypeId
      }
    ) {
      ...SourceFragment
    }
  }
  ${SourceFragment}
`;
