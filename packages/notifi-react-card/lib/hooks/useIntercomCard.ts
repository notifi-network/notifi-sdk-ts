import { useEffect, useState } from 'react';

import { useNotifiClientContext } from '../context';
import { IntercomCardConfigItemV1 } from './IntercomCardConfig';

export type Data = IntercomCardConfigItemV1;

export type LoadingState = Readonly<{
  state: 'loading';
}>;

export type FetchedState = Readonly<{
  state: 'fetched';
  data: Data;
}>;

export type ErrorState = Readonly<{
  state: 'error';
  reason: unknown;
}>;

export type IntercomCardState = LoadingState | FetchedState | ErrorState;

export const useIntercomCard = (cardId: string): IntercomCardState => {
  const [state, setState] = useState<IntercomCardState>({
    state: 'loading',
  });

  const { client } = useNotifiClientContext();

  useEffect(() => {
    setState({ state: 'loading' });
    client
      .fetchSubscriptionCard({
        type: 'INTERCOM_CARD',
        id: cardId,
      })
      .then((result) => {
        const value = result.dataJson;
        if (value === null) {
          return Promise.reject(new Error('Failed to fetch data'));
        }

        const obj = JSON.parse(value);
        if (obj.version !== 'IntercomV1') {
          return Promise.reject(new Error('Unsupported config format'));
        }

        const card = obj as IntercomCardConfigItemV1;

        setState({
          state: 'fetched',
          data: card,
        });
      })
      .catch((error: unknown) => {
        setState({
          state: 'error',
          reason: error,
        });
      });
  }, [cardId]);

  return state;
};
