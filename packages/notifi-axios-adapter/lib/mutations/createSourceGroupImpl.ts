import {
  sourceGroupFragment,
  sourceGroupFragmentDependencies,
} from '../fragments';
import { makeRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
import {
  CreateSourceGroupInput,
  CreateSourceGroupResult,
} from '@notifi-network/notifi-core';

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
