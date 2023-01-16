import type { Types as Gql } from '@notifi-network/notifi-graphql';

export type Message<Type extends Gql.MessageType, Payload> = Readonly<{
  type: Type;
  payload: Payload;
}>;
