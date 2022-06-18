import { Operation, TargetType } from '../models';

type KeyValuePair<TKey, TValue> = Readonly<{
  key: TKey;
  value: TValue;
}>;

export type BroadcastMessageInput = Readonly<{
  idempotencyKey?: string;
  topicName: string;
  targetTemplates?: ReadonlyArray<KeyValuePair<TargetType, string>>;
  timestamp: number;
  variables?: ReadonlyArray<KeyValuePair<string, string>>;
  walletBlockchain: 'OFF_CHAIN';
  signature: string;
}>;

export type BroadcastMessageResult = Readonly<{
  id: string | null;
}>;

export type BroadcastMessageService = Readonly<{
  broadcastMessage: Operation<BroadcastMessageInput, BroadcastMessageResult>;
}>;
