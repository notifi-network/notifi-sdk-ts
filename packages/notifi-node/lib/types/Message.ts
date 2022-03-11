export type Message<Type extends string, Payload> = Readonly<{
  type: Type;
  payload: Payload;
}>;
