import { gql } from 'graphql-request';

export const BroadcastMessage = gql`
  mutation broadcastMessage(
    $idempotencyKey: String
    $topicName: String!
    $targetTemplates: [KeyValuePairOfTargetTypeAndStringInput!]
    $variables: [KeyValuePairOfStringAndStringInput!]
    $timestamp: Long!
    $walletBlockchain: WalletBlockchain!
    $signature: String!
  ) {
    broadcastMessage(
      broadcastMessageInput: {
        idempotencyKey: $idempotencyKey
        sourceAddress: $topicName
        targetTemplates: $targetTemplates
        variables: $variables
        timestamp: $timestamp
        walletBlockchain: $walletBlockchain
      }
      signature: $signature
    ) {
      id
    }
  }
`;
