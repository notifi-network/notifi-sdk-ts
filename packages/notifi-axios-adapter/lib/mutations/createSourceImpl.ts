import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateSourceInput,
  CreateSourceResult,
} from '@notifi-network/notifi-core';

import { sourceFragment, sourceFragmentDependencies } from '../fragments';

const DEPENDENCIES = [...sourceFragmentDependencies, sourceFragment];

const MUTATION = `
mutation createSource(
  $name: String!
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
    ...sourceFragment
  }
}
`.trim();

const createSourceImpl = makeRequest<CreateSourceInput, CreateSourceResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'createSource',
);

export default createSourceImpl;
