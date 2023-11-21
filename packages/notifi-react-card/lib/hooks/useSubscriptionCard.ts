import { CardConfigItem } from '@notifi-network/notifi-frontend-client';
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

export type Data = CardConfigItem;

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
  const { client, isUsingFrontendClient, frontendClient } =
    useNotifiClientContext();

  useEffect(() => {
    if (demoPreview) {
      return setState(() => ({
        state: 'fetched',
        data: demoPreview.data,
      }));
    }

    let card: CardConfigItem | undefined;
    setState({ state: 'loading' });
    (isUsingFrontendClient ? frontendClient : client)
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

        if (!card?.version) {
          return Promise.reject(new Error('Failed to fetch data'));
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
  }, [input.id, input.type, demoPreview, isUsingFrontendClient]);

  return state;
};
