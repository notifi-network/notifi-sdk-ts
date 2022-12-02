import type { Alert } from '@notifi-network/notifi-core';
import { PropsWithChildren } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { FetchedCardView, useFetchedCardState } from '../hooks';
import {
  IntercomCardView,
  useIntercomCardState,
} from '../hooks/useIntercomCardState';
import { AlertConfiguration } from '../utils';
import { NotifiParams } from './NotifiContext';

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert | undefined>>;
  email: string;
  params: NotifiParams;
  phoneNumber: string;
  telegramId: string;
  telegramConfirmationUrl?: string;
  useHardwareWallet: boolean;

  cardView: FetchedCardView;
  setCardView: React.Dispatch<React.SetStateAction<FetchedCardView>>;
  intercomCardView: IntercomCardView;
  setIntercomCardView: React.Dispatch<React.SetStateAction<IntercomCardView>>;
  setAlerts: (alerts: Record<string, Alert | undefined>) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setTelegramId: (telegramId: string) => void;
  setEmailErrorMessage: (message: string) => void;
  setTelegramErrorMessage: (message: string) => void;
  setSmsErrorMessage: (message: string) => void;
  emailErrorMessage: string;
  smsErrorMessage: string;
  telegramErrorMessage: string;
  setTelegramConfirmationUrl: (
    telegramConfirmationUrl: string | undefined,
  ) => void;
  setUseHardwareWallet: (hardwareWallet: boolean) => void;
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
  setSupportAvatarUrl: (supportAvatarUrl: string) => void;
  supportAvatarUrl: string;
}>;

const NotifiSubscriptionContext = createContext<NotifiSubscriptionData>(
  {} as unknown as NotifiSubscriptionData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

export const NotifiSubscriptionContextProvider: React.FC<
  PropsWithChildren<NotifiParams>
> = ({ children, ...params }) => {
  const [conversationId, setConversationId] = useState<string>('');
  const [supportAvatarUrl, setSupportAvatarUrl] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [hasChatAlert, setHasChatAlert] = useState<boolean>(false);
  const [telegramId, setTelegramId] = useState<string>('');
  const { cardView, setCardView } = useFetchedCardState();
  const { intercomCardView, setIntercomCardView } = useIntercomCardState();
  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [telegramErrorMessage, setTelegramErrorMessage] = useState<string>('');
  const [smsErrorMessage, setSmsErrorMessage] = useState<string>('');
  const [emailIdThatNeedsConfirmation, setEmailIdThatNeedsConfirmation] =
    useState<string>('');
  const [isSmsConfirmed, setIsSmsConfirmed] = useState<boolean | null>(null);
  const [telegramConfirmationUrl, setTelegramConfirmationUrl] = useState<
    string | undefined
  >(undefined);

  const [alerts, setAlerts] = useState<Record<string, Alert | undefined>>({});
  const [useHardwareWallet, setUseHardwareWallet] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const value = {
    alerts,
    email,
    loading,
    params,
    phoneNumber,
    telegramId,
    cardView,
    telegramConfirmationUrl,
    setSmsErrorMessage,
    setEmailErrorMessage,
    smsErrorMessage,
    emailIdThatNeedsConfirmation,
    isSmsConfirmed,
    setEmailIdThatNeedsConfirmation,
    setIsSmsConfirmed,
    emailErrorMessage,
    useHardwareWallet,
    setAlerts,
    setCardView,
    setEmail,
    setLoading,
    setPhoneNumber,
    setTelegramId,
    setTelegramConfirmationUrl,
    setUseHardwareWallet,
    intercomCardView,
    setIntercomCardView,
    telegramErrorMessage,
    setTelegramErrorMessage,
    hasChatAlert,
    setHasChatAlert,
    conversationId,
    setConversationId,
    userId,
    setUserId,
    setSupportAvatarUrl,
    supportAvatarUrl,
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
