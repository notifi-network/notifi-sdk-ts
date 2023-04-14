import { ClientFetchSubscriptionCardInput } from '@notifi-network/notifi-core';
import { useEffect, useState } from 'react';

import {
  useNotifiClientContext,
  useNotifiDemoPreviewContext,
} from '../context';
import { CardConfigItemV1 } from './SubscriptionCardConfig';
import { ErrorViewState } from './useFetchedCardState';

export type LoadingState = Readonly<{
  state: 'loading';
}>;

export type Data = CardConfigItemV1;

export type FetchedState = Readonly<{
  state: 'fetched';
  data: Data;
}>;

export type SubscriptionCardState =
  | LoadingState
  | FetchedState
  | ErrorViewState;

export const useSubscriptionCard = (
  input: ClientFetchSubscriptionCardInput,
): SubscriptionCardState => {
  const [state, setState] = useState<SubscriptionCardState>({
    state: 'loading',
  });
  const { demoPreview } = useNotifiDemoPreviewContext();
  const { client } = useNotifiClientContext();

  useEffect(() => {
    setState({ state: 'loading' });
    client
      .fetchSubscriptionCard(input)
      .then((result) => {
        const value = result.dataJson;
        if (value === null) {
          return Promise.reject(new Error('Failed to fetch data'));
        }

        const obj = JSON.parse(value);
        if (obj.version !== 'v1') {
          return Promise.reject(new Error('Unsupported config format'));
        }

        const card = obj as CardConfigItemV1;

        setState({
          state: 'fetched',
          data: card,
        });
      })
      .catch((error: unknown) => {
        if (demoPreview) {
          setState(() => ({
            state: 'fetched',
            data: demoPreview.data,
          }));
        } else {
          setState({
            state: 'error',
            reason: error,
          });
        }
      });
  }, [input.id, input.type, demoPreview]);

  return state;
};
