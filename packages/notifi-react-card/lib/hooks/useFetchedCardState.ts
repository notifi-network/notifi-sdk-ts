import { useState } from 'react';

export type AlertsView = Readonly<{
  state: 'alerts';
}>;
export type HistoryView = Readonly<{
  state: 'history';
}>;
export type EditInfoView = Readonly<{
  state: 'edit';
}>;

export type FetchedCardView = AlertsView | HistoryView | EditInfoView;

export const useFetchedCardState = () => {
  const [cardView] = useState<FetchedCardView>({
    state: 'edit',
  });

  return {
    cardView,
  };
};
