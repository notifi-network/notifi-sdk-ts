import {
  collectDependencies,
  makeAuthenticatedRequest,
} from '@notifi-network/notifi-axios-utils';

type KeyValuePair<TKey, TValue> = Readonly<{
  key: TKey;
  value: TValue;
}>;

type TargetType = 'SMS' | 'EMAIL' | 'TELEGRAM';

export type BroadcastMessageInput = Readonly<{
  topicName: string;
  idempotencyKey?: string;
  targetTemplates?: ReadonlyArray<KeyValuePair<TargetType, string>>;
  variables?: ReadonlyArray<KeyValuePair<string, string>>;
}>;

export type BroadcastMessageResult = Readonly<{
  id: string | null;
}>;

const DEPENDENCIES: string[] = [];

const MUTATION = `
mutation broadcastMessage(
  $idempotencyKey: String
  $topicName: String!
  $targetTemplates: [KeyValuePairOfTargetTypeAndStringInput!]
  $variables: [KeyValuePairOfStringAndStringInput!]
) {
  broadcastMessage(broadcastMessageInput: {
    idempotencyKey: $idempotencyKey
    sourceAddress: $topicName
    targetTemplates: $targetTemplates
    variables: $variables
    timestamp: 0
    walletBlockchain: OFF_CHAIN
  }, signature: "") {
    id
  }
}
`.trim();

const broadcastMessageImpl = makeAuthenticatedRequest<
  BroadcastMessageInput,
  BroadcastMessageResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'broadcastMessage');

export default broadcastMessageImpl;
