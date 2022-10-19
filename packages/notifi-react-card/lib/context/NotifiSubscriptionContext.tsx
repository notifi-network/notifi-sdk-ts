import type { Alert } from '@notifi-network/notifi-core';
import { PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

import { FetchedCardView, useFetchedCardState } from '../hooks';

import { NotifiParams } from './NotifiContext';

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert | undefined>>;
  email: string;
  params: NotifiParams;
  phoneNumber: string;
  telegramId: string;
  emailId: string;
  telegramConfirmationUrl?: string;
  useHardwareWallet: boolean;
  cardView: FetchedCardView;
  setCardView: React.Dispatch<React.SetStateAction<FetchedCardView>>;
  setAlerts: (alerts: Record<string, Alert | undefined>) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setTelegramId: (telegramId: string) => void;
  setEmailId: (emailId: string) => void;
  setEmailErrorMessage: (message: string) => void;
  setSmsErrorMessage: (message: string) => void;
  emailErrorMessage: string;
  smsErrorMessage: string;
  setTelegramConfirmationUrl: (
    telegramConfirmationUrl: string | undefined,
  ) => void;
  setUseHardwareWallet: (hardwareWallet: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isEmailConfirmed: boolean | null;
  isSmsConfirmed: boolean | null;
  setIsEmailConfirmed: (isConfirmed: boolean | null) => void;
  setIsSmsConfirmed: (isConfirmed: boolean | null) => void;
}>;

const NotifiSubscriptionContext = createContext<NotifiSubscriptionData>(
  {} as unknown as NotifiSubscriptionData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

export const NotifiSubscriptionContextProvider: React.FC<
  PropsWithChildren<NotifiParams>
> = ({ children, ...params }) => {
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [telegramId, setTelegramId] = useState<string>('');
  const [emailId, setEmailId] = useState<string>('');
  const { cardView, setCardView } = useFetchedCardState();

  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [smsErrorMessage, setSmsErrorMessage] = useState<string>('');
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean | null>(
    null,
  );
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
    isEmailConfirmed,
    isSmsConfirmed,
    setIsEmailConfirmed,
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
    emailId,
    setEmailId,
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
