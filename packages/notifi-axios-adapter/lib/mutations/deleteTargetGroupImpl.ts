import {
  DeleteTargetGroupInput,
  DeleteTargetGroupResult
} from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeRequest } from '../utils/axiosRequest';

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation deleteTargetGroup(
  $id: String!
) {
  deleteTargetGroup(TargetGroupInput: {
    id: $id
  }) {
    id
  }
}
`.trim();

const deleteTargetGroupImpl = makeRequest<DeleteTargetGroupInput, DeleteTargetGroupResult>(
  collectDependencies(...DEPENDENCIES, MUTATION),
  'deleteTargetGroup'
);

export default deleteTargetGroupImpl;
