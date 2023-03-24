import type { Alert, ConnectedWallet } from '@notifi-network/notifi-core';
import { PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

import { FetchedCardViewState, useFetchedCardState } from '../hooks';
import {
  IntercomCardView,
  useIntercomCardState,
} from '../hooks/useIntercomCardState';
import { NotifiParams } from './NotifiContext';
import { EditFormType, FormField } from './constants';

type RecoverableError = Readonly<{
  type: 'recoverableError';
  message: string;
  onClick: () => void;
  tooltip?: string;
}>;

type UnrecoverableError = Readonly<{
  type: 'unrecoverableError';
  message: string;
  tooltip?: string;
}>;

type DestinationError = UnrecoverableError | RecoverableError | undefined;
type DestinationErrors = Record<FormField, DestinationError>;

export type DestinationErrorMessages = DestinationErrors;

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert | undefined>>;
  connectedWallets: ReadonlyArray<ConnectedWallet>;
  setConnectedWallets: React.Dispatch<
    React.SetStateAction<ReadonlyArray<ConnectedWallet>>
  >;
  destinationErrorMessages: DestinationErrorMessages;
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
  setUseHardwareWallet: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isSmsConfirmed: boolean | null;
  setIsSmsConfirmed: (isConfirmed: boolean | null) => void;
  hasChatAlert: boolean;
  setHasChatAlert: (hasChatAlert: boolean) => void;
  conversationId: string;
  setConversationId: (conversationId: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  emailIdThatNeedsConfirmation: string;
  setEmailIdThatNeedsConfirmation: (emailId: string) => void;
  setEmailErrorMessage: (value: string) => void;
  setTelegramConfirmationUrl: (
    telegramConfirmationUrl: string | undefined,
  ) => void;
  setPhoneNumberErrorMessage: (value: string) => void;
  setTelegramErrorMessage: (value: string) => void;
  resetErrorMessageState: () => void;
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

  const [destinationErrorMessages, setDestinationErrorMessages] =
    useState<DestinationErrorMessages>({
      email: undefined,
      telegram: { type: 'unrecoverableError', message: 'tsadfasdf' },
      phoneNumber: undefined,
    });

  const handleErrorMessage = ({ field, value }: EditFormType) => {
    setDestinationErrorMessages((destinationErrorMessages) => ({
      ...destinationErrorMessages,
      [field]: value,
    }));
  };

  const setEmailErrorMessage = (value: string) => {
    handleErrorMessage({ field: 'email', value });
  };

  const setTelegramErrorMessage = (value: string) => {
    handleErrorMessage({ field: 'telegram', value });
  };

  const setPhoneNumberErrorMessage = (value: string) => {
    handleErrorMessage({ field: 'phoneNumber', value });
  };

  const resetErrorMessageState = () => {
    setDestinationErrorMessages({
      email: undefined,
      telegram: undefined,
      phoneNumber: undefined,
    });
  };

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
    destinationErrorMessages,
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
    setEmailErrorMessage,
    setTelegramErrorMessage,
    setPhoneNumberErrorMessage,
    resetErrorMessageState,
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
