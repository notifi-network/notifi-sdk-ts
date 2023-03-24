import type { Alert, ConnectedWallet } from '@notifi-network/notifi-core';
import { PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

import {
  CardConfigItemV1,
  FetchedCardViewState,
  useFetchedCardState,
} from '../hooks';
import {
  IntercomCardView,
  useIntercomCardState,
} from '../hooks/useIntercomCardState';
import { NotifiParams } from './NotifiContext';

export type DemoPreview = {
  view: FetchedCardViewState['state'];
  data: CardConfigItemV1;
};

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert | undefined>>;
  connectedWallets: ReadonlyArray<ConnectedWallet>;
  setConnectedWallets: React.Dispatch<
    React.SetStateAction<ReadonlyArray<ConnectedWallet>>
  >;
  email: string;
  params: NotifiParams;
  phoneNumber: string;
  telegramId: string;
  telegramConfirmationUrl?: string;
  useHardwareWallet: boolean;
  cardView: FetchedCardViewState;
  setCardView: React.Dispatch<React.SetStateAction<FetchedCardViewState>>;
  intercomCardView: IntercomCardView;
  setIntercomCardView: React.Dispatch<React.SetStateAction<IntercomCardView>>;
  setAlerts: (alerts: Record<string, Alert | undefined>) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setTelegramId: (telegramId: string) => void;
  setTelegramConfirmationUrl: (
    telegramConfirmationUrl: string | undefined,
  ) => void;
  setUseHardwareWallet: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isSmsConfirmed: boolean | null;
  setIsSmsConfirmed: (isConfirmed: boolean | null) => void;
  emailIdThatNeedsConfirmation: string;
  setEmailIdThatNeedsConfirmation: (emailId: string) => void;
  hasChatAlert: boolean;
  setHasChatAlert: (hasChatAlert: boolean) => void;
  conversationId: string;
  setConversationId: (conversationId: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  demoPreview: DemoPreview | null;
  setDemoPreview: React.Dispatch<React.SetStateAction<DemoPreview | null>>;
}>;

const NotifiSubscriptionContext = createContext<NotifiSubscriptionData>(
  {} as unknown as NotifiSubscriptionData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

export const NotifiSubscriptionContextProvider: React.FC<
  PropsWithChildren<NotifiParams>
> = ({ children, ...params }) => {
  const [conversationId, setConversationId] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const [hasChatAlert, setHasChatAlert] = useState<boolean>(false);
  const { cardView, setCardView } = useFetchedCardState();
  const { intercomCardView, setIntercomCardView } = useIntercomCardState();

  const [emailIdThatNeedsConfirmation, setEmailIdThatNeedsConfirmation] =
    useState<string>('');
  const [isSmsConfirmed, setIsSmsConfirmed] = useState<boolean | null>(null);
  const [telegramConfirmationUrl, setTelegramConfirmationUrl] = useState<
    string | undefined
  >(undefined);

  const [alerts, setAlerts] = useState<Record<string, Alert | undefined>>({});
  const [connectedWallets, setConnectedWallets] = useState<
    ReadonlyArray<ConnectedWallet>
  >([]);
  const [useHardwareWallet, setUseHardwareWallet] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [telegramId, setTelegramId] = useState<string>('');
  const [demoPreview, setDemoPreview] = useState<DemoPreview | null>({
    view: 'expired',
    data: JSON.parse(defaultDemoConfigV1),
  });

  const value = {
    alerts,
    connectedWallets,
    email,
    loading,
    params,
    phoneNumber,
    telegramId,
    cardView,
    telegramConfirmationUrl,
    emailIdThatNeedsConfirmation,
    isSmsConfirmed,
    setEmailIdThatNeedsConfirmation,
    setIsSmsConfirmed,
    useHardwareWallet,
    setAlerts,
    setConnectedWallets,
    setCardView,
    setEmail,
    setLoading,
    setPhoneNumber,
    setTelegramId,
    setTelegramConfirmationUrl,
    setUseHardwareWallet,
    intercomCardView,
    setIntercomCardView,
    hasChatAlert,
    setHasChatAlert,
    conversationId,
    setConversationId,
    userId,
    setUserId,
    demoPreview,
    setDemoPreview,
  };

  return (
    <NotifiSubscriptionContext.Provider value={value}>
      {children}
    </NotifiSubscriptionContext.Provider>
  );
};

export const useNotifiSubscriptionContext: () => NotifiSubscriptionData =
  () => {
    const data = useContext(NotifiSubscriptionContext);
    return data;
  };

const defaultDemoConfigV1 = `
  {
    "version": "v1",
    "id": "notofi.network.id",
    "name": "notofi.network.name",
    "eventTypes": [],
    "inputs": [],
    "contactInfo": {
      "email": {
        "active": true
      }
    }
  }
  `;
