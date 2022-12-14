import { useState } from 'react';

export type PreviewViewState = Readonly<{
  state: 'preview';
}>;
export type AlertHistoryViewState = Readonly<{
  state: 'history';
}>;
export type EditInfoViewState = Readonly<{
  state: 'edit';
}>;

export type FetchedCardViewState =
  | PreviewViewState
  | AlertHistoryViewState
  | EditInfoViewState;

export const useFetchedCardState = () => {
  const [cardView, setCardView] = useState<FetchedCardViewState>({
    // state: 'edit',
    state: 'history',
  });

  return {
    cardView,
    setCardView,
  };
};
