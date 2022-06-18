import { userFragment, userFragmentDependencies } from '../fragments';
import {
  collectDependencies,
  makeRequest,
} from '@notifi-network/notifi-axios-utils';
import {
  BroadcastMessageInput,
  BroadcastMessageResult,
} from '@notifi-network/notifi-core';

const DEPENDENCIES = [...userFragmentDependencies, userFragment];

const MUTATION = `
mutation broadcastMessage(
  $idempotencyKey: String
  $topicName: String!
  $targetTemplates: [KeyValuePairOfTargetTypeAndStringInput!]
  $variables: [KeyValuePairOfStringAndStringInput!]
  $timestamp: Long!
  $walletBlockchain: WalletBlockchain!
  $signature: String!
) {
  broadcastMessage(broadcastMessageInput: {
    idempotencyKey: $idempotencyKey
    sourceAddress: $topicName
    targetTemplates: $targetTemplates
    variables: $variables
    timestamp: $timestamp
    walletBlockchain: $walletBlockchain
  }, signature: $signature) {
    id
  }
}
`.trim();

const broadcastMessageImpl = makeRequest<
  BroadcastMessageInput,
  BroadcastMessageResult
>(collectDependencies(...DEPENDENCIES, MUTATION), 'broadcastMessage');

export default broadcastMessageImpl;
