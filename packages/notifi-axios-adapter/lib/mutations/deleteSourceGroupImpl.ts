import { makeRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
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
