import {
  CreateTargetGroupInput,
  CreateTargetGroupResult
} from '@notifi-network/notifi-core';
import collectDependencies from '../utils/collectDependencies';
import { makeRequest } from '../utils/axiosRequest';
import {
  targetGroupFragment,
  targetGroupFragmentDependencies
} from '../fragments';

const DEPENDENCIES = [...targetGroupFragmentDependencies, targetGroupFragment];

const MUTATION = `
mutation createTargetGroup(
  $name: String!
  $emailTargetIds: [String!]!
  $smsTargetIds: [String!]!
  $telegramTargetIds: [String!]!
) {
  createTargetGroup(targetGroupInput: {
    name: $name
    emailTargetIds: $emailTargetIds
    smsTargetIds: $smsTargetIds
    telegramTargetIds: $telegramTargetIds
  }) {
    ...targetGroupFragment
  }
}
`.trim();

const createTargetGroupImpl = makeRequest<
  CreateTargetGroupInput,
  CreateTargetGroupResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'createTargetGroup');

export default createTargetGroupImpl;
