import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { FetchedCardViewState, WebhookContactInfo } from '../hooks';

export type DemoPreview = {
  view: FetchedCardViewState['state'];
  data: CardConfigItemV1;
};

export const defaultDemoConfigV1: CardConfigItemV1 = {
  version: 'v1',
  id: '@notifi.network', // Shown as dummy telegram id
  name: 'notifi@notifi.network', // Shown as dummy email field
  eventTypes: [],
  inputs: [],
  contactInfo: {
    sms: {
      active: true,
      supportedCountryCodes: ['+1', '+886'],
    },
    email: {
      active: true,
    },
    telegram: {
      active: true,
    },
    discord: {
      active: false,
    },
    slack: {
      active: false,
    },
    wallet: {
      active: false,
    },
    webhook: {} as unknown as WebhookContactInfo,
  },
};

export type NotifiDemoPreviewContextData = Readonly<{
  demoPreview: DemoPreview;
}>;

const NotifiDemoPreviewContext = createContext<NotifiDemoPreviewContextData>(
  {} as unknown as NotifiDemoPreviewContextData, // Intentionally empty in default
);

export const NotifiDemoPreviewContextProvider: React.FC<
  PropsWithChildren<DemoPreview>
> = ({ children, view, data }) => {
  const demoPreview = useMemo(() => ({ view, data }), [view, data]);

  return (
    <NotifiDemoPreviewContext.Provider value={{ demoPreview }}>
      {children}
    </NotifiDemoPreviewContext.Provider>
  );
};

export const useNotifiDemoPreviewContext = () =>
  useContext(NotifiDemoPreviewContext);
