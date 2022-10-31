export type FetchedState = Readonly<{
  state: 'fetched';
  data: Data;
}>;

export type Data = Readonly<{
  hasStartedChatting: boolean;
}>;
