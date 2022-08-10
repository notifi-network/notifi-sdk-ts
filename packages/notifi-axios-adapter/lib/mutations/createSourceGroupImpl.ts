import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateSourceGroupInput,
  CreateSourceGroupResult,
} from '@notifi-network/notifi-core';

import {
  sourceGroupFragment,
  sourceGroupFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [...sourceGroupFragmentDependencies, sourceGroupFragment];

const MUTATION = `
mutation createSourceGroup(
  $name: String!
  $sourceIds: [String!]!
) {
  createSourceGroup(
    sourceGroupInput: {
      name: $name
      sourceIds: $sourceIds
    }
  ) {
    ...sourceGroupFragment
  }
}
`.trim();

const createSourceGroupImpl = makeRequest<
  CreateSourceGroupInput,
  CreateSourceGroupResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createSourceGroup');

export default createSourceGroupImpl;
