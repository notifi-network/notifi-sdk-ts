import { useEffect, useRef, useState } from 'react';

import { useNotifiSubscriptionContext } from '../context';

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
  const { email, phoneNumber, telegramId } = useNotifiSubscriptionContext();

  const [cardView, setCardView] = useState<FetchedCardView>({
    state: 'edit',
  });

  const firstLoad = useRef(false);

  useEffect(() => {
    if (firstLoad.current) {
      return;
    }

    firstLoad.current = true;

    // could be undefined for FTU, so we need to check for undefined as well
    if (
      (email !== '' && email !== undefined) ||
      (phoneNumber !== '' && phoneNumber !== undefined) ||
      (telegramId !== '' && telegramId !== undefined)
    ) {
      setCardView({ state: 'preview' });
    }
  }, [email, phoneNumber, telegramId, setCardView, cardView]);

  return {
    cardView,
    setCardView,
    useNotifiSubscriptionContext,
  };
};
