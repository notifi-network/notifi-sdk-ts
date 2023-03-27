import { ClientFetchSubscriptionCardInput } from '@notifi-network/notifi-core';
import { useEffect, useState } from 'react';

import {
  useNotifiClientContext,
  useNotifiDemoPreviewContext,
} from '../context';
import { CardConfigItemV1 } from './SubscriptionCardConfig';

export type LoadingState = Readonly<{
  state: 'loading';
}>;

export type Data = CardConfigItemV1;

export type FetchedState = Readonly<{
  state: 'fetched';
  data: Data;
}>;

export type ErrorState = Readonly<{
  state: 'error';
  reason: unknown;
}>;

export type SubscriptionCardState = LoadingState | FetchedState | ErrorState;

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
        setState({
          state: 'error',
          reason: error,
        });
      });
  }, [input.id, input.type]);

  useEffect(() => {
    if (demoPreview && state.state === 'error') {
      setState(() => ({
        state: 'fetched',
        data: demoPreview.data,
      }));
    }
  }, [state]);

  return state;
};
