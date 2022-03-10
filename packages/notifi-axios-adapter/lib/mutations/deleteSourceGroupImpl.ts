import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  DeleteSourceGroupInput,
  DeleteSourceGroupResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation deleteSourceGroup(
  $id: String!
) {
  deleteSourceGroup(sourceGroupInput: {
    id: $id
  }) {
    id
  }
}
`.trim();

const deleteSourceGroupImpl = makeRequest<
  DeleteSourceGroupInput,
  DeleteSourceGroupResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'deleteSourceGroup');

export default deleteSourceGroupImpl;
