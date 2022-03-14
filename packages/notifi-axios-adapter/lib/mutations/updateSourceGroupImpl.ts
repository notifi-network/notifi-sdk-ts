import {
  sourceGroupFragment,
  sourceGroupFragmentDependencies,
} from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  UpdateSourceGroupInput,
  UpdateSourceGroupResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [...sourceGroupFragmentDependencies, sourceGroupFragment];

const MUTATION = `
mutation updateSourceGroup(
  $id: String!
  $name: String!
  $sourceIds: [String!]!
) {
  updateSourceGroup(
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
