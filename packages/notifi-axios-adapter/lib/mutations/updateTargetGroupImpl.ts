import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  UpdateTargetGroupInput,
  UpdateTargetGroupResult,
} from '@notifi-network/notifi-core';

import {
  targetGroupFragment,
  targetGroupFragmentDependencies,
} from '../fragments';

const DEPENDENCIES = [...targetGroupFragmentDependencies, targetGroupFragment];

const MUTATION = `
mutation updateTargetGroup(
  $id: String!
  $name: String!
  $emailTargetIds: [String!]!
  $smsTargetIds: [String!]!
  $telegramTargetIds: [String!]!
  $discordTargetIds: [String!]!
) {
  updateTargetGroup: createTargetGroup(targetGroupInput: {
    id: $id
    name: $name
    emailTargetIds: $emailTargetIds
    smsTargetIds: $smsTargetIds
    telegramTargetIds: $telegramTargetIds
    discordTargetIds: $discordTargetIds
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
