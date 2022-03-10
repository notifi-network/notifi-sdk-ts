import {
  targetGroupFragment,
  targetGroupFragmentDependencies,
} from '../fragments';
import { makeRequest } from '../utils/axiosRequest';
import collectDependencies from '../utils/collectDependencies';
import {
  UpdateTargetGroupInput,
  UpdateTargetGroupResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [...targetGroupFragmentDependencies, targetGroupFragment];

const MUTATION = `
mutation updateTargetGroup(
  $id: String!
  $name: String!
  $emailTargetIds: [String!]!
  $smsTargetIds: [String!]!
  $telegramTargetIds: [String!]!
) {
  updateTargetGroup: createTargetGroup(targetGroupInput: {
    id: $id
    name: $name
    emailTargetIds: $emailTargetIds
    smsTargetIds: $smsTargetIds
    telegramTargetIds: $telegramTargetIds
  }) {
    ...targetGroupFragment
  }
}
`.trim();

const updateTargetGroupImpl = makeRequest<
  UpdateTargetGroupInput,
  UpdateTargetGroupResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'updateTargetGroup');

export default updateTargetGroupImpl;
