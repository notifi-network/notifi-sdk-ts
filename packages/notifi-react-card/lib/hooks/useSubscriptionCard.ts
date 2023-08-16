import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import { useEffect, useState } from 'react';

import {
  useNotifiClientContext,
  useNotifiDemoPreviewContext,
} from '../context';
import { ErrorViewState } from './useFetchedCardState';

type ClientFetchSubscriptionCardInput = Omit<
  Types.FindTenantConfigInput,
  'tenant'
>;

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
  const {
    client,
    canary: { isActive: isCanaryEnabled, frontendClient },
  } = useNotifiClientContext();

  useEffect(() => {
    setState({ state: 'loading' });
    let card: CardConfigItemV1 | undefined;
    (isCanaryEnabled ? frontendClient : client)
      .fetchSubscriptionCard(input)
      .then((result) => {
        if ('dataJson' in result) {
          if (!result.dataJson) {
            return Promise.reject(new Error('Failed to fetch data'));
          }
          card = JSON.parse(result.dataJson);
        } else if ('version' in result && result.version !== 'IntercomV1') {
          card = result;
        }

        if (card?.version !== 'v1') {
          return Promise.reject(new Error('Unsupported config format'));
        }

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
  }, [input.id, input.type, demoPreview, isCanaryEnabled]);

  return state;
};
