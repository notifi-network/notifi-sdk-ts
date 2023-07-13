import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  CreateTargetGroupInput,
  CreateTargetGroupResult,
} from '@notifi-network/notifi-core';

import {
  targetGroupFragment,
  targetGroupFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [...targetGroupFragmentDependencies, targetGroupFragment];

const MUTATION = `
mutation createTargetGroup(
  $name: String!
  $emailTargetIds: [String!]!
  $smsTargetIds: [String!]!
  $telegramTargetIds: [String!]!
  $discordTargetIds: [String!]!
  $web3TargetIds: [String!]!
) {
  createTargetGroup(targetGroupInput: {
    name: $name
    emailTargetIds: $emailTargetIds
    smsTargetIds: $smsTargetIds
    telegramTargetIds: $telegramTargetIds
    discordTargetIds: $discordTargetIds
    web3TargetIds: $web3TargetIds
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
