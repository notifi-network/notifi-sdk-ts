import React, { createContext, useContext, useEffect } from 'react';

import {
  CardConfigItemV1,
  FetchedCardViewState,
  WebhookContactInfo,
} from '../hooks';
import { NotifiParams } from './NotifiContext';

export type DemoPreview = {
  view: FetchedCardViewState['state'];
  data: CardConfigItemV1;
};

export const defaultDemoConfigV1: CardConfigItemV1 = {
  version: 'v1',
  id: '@notifi.network', // Shown as dummy telegram id
  name: 'notofi@notifi.network', // Shown as dummy email field
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
    webhook: {} as unknown as WebhookContactInfo,
  },
};

export type NotifiDemoPreviewContextData = Readonly<{
  demoPreview?: DemoPreview;
  setDemoPreview: React.Dispatch<React.SetStateAction<DemoPreview | undefined>>;
}>;

const NotifiDemoPreviewContext = createContext<NotifiDemoPreviewContextData>(
  {} as unknown as NotifiDemoPreviewContextData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

export const NotifiDemoPreviewContextProvider: React.FC<NotifiParams> = ({
  children,
  ...params
}) => {
  const [demoPreview, setDemoPreview] = React.useState<DemoPreview>();
  useEffect(() => {
    setDemoPreview(params.demoPreview);
  }, [params.demoPreview]);

  return (
    <NotifiDemoPreviewContext.Provider value={{ demoPreview, setDemoPreview }}>
      {children}
    </NotifiDemoPreviewContext.Provider>
  );
};

export const useNotifiDemoPreviewContext = () =>
  useContext(NotifiDemoPreviewContext);
