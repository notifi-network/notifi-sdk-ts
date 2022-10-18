import { useState } from 'react';

export type PreviewView = Readonly<{
  state: 'preview';
}>;
export type HistoryView = Readonly<{
  state: 'history';
}>;
export type EditInfoView = Readonly<{
  state: 'edit';
}>;

export type FetchedCardView = PreviewView | HistoryView | EditInfoView;

export const useFetchedCardState = () => {
  const [cardView, setCardView] = useState<FetchedCardView>({
    state: 'edit',
  });

  return {
    cardView,
    setCardView,
  };
};
