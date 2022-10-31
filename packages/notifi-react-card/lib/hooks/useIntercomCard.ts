export type FetchedState = Readonly<{
  state: 'fetched';
  data: Data;
}>;

export type LoadingState = Readonly<{
  state: 'loading';
}>;

export type ErrorState = Readonly<{
  state: 'error';
  reason: unknown;
}>;

export type Data = Readonly<{
  hasStartedChatting: boolean;
}>;

export type IntercomCardState = LoadingState | FetchedState | ErrorState;

export const useIntercomCard = (): IntercomCardState => {
  return {
    state: 'fetched',
    data: {
      hasStartedChatting: false,
    },
  };
};
