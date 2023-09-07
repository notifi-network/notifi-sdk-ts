import { IntercomCardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import { useEffect, useState } from 'react';

import { useNotifiClientContext } from '../context';

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

  const { client, isUsingFrontendClient, frontendClient } =
    useNotifiClientContext();

  useEffect(() => {
    setState({ state: 'loading' });
    let card: IntercomCardConfigItemV1 | undefined;
    (isUsingFrontendClient ? frontendClient : client)
      .fetchSubscriptionCard({
        type: 'INTERCOM_CARD',
        id: cardId,
      })
      .then((result) => {
        if ('dataJson' in result) {
          if (!result.dataJson) {
            return Promise.reject(new Error('Failed to fetch data'));
          }
          card = JSON.parse(result.dataJson);
        } else if ('version' in result) {
          card = result as IntercomCardConfigItemV1;
        }

        if (card?.version !== 'IntercomV1') {
          return Promise.reject(new Error('Unsupported config format'));
        }

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
