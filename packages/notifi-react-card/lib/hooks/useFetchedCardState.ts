import { useState } from 'react';

export type PreviewView = Readonly<{
  state: 'preview';
}>;
export type AlertHistoryView = Readonly<{
  state: 'history';
}>;
export type EditInfoView = Readonly<{
  state: 'edit';
}>;

export type FetchedCardView = PreviewView | AlertHistoryView | EditInfoView;

export const useFetchedCardState = () => {
  const [cardView, setCardView] = useState<FetchedCardView>({
    // state: 'edit',
    state: 'history',
  });

  return {
    cardView,
    setCardView,
  };
};
