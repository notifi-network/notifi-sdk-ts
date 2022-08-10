import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  UpdateSourceGroupInput,
  UpdateSourceGroupResult,
} from '@notifi-network/notifi-core';

import {
  sourceGroupFragment,
  sourceGroupFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [...sourceGroupFragmentDependencies, sourceGroupFragment];

const MUTATION = `
mutation updateSourceGroup(
  $id: String!
  $name: String!
  $sourceIds: [String!]!
) {
  updateSourceGroup: createSourceGroup(
    sourceGroupInput: {
      id: $id
      name: $name
      sourceIds: $sourceIds
    }
  ) {
    ...sourceGroupFragment
  }
}
`.trim();

const updateSourceGroupImpl = makeRequest<
  UpdateSourceGroupInput,
  UpdateSourceGroupResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'updateSourceGroup');

export default updateSourceGroupImpl;
