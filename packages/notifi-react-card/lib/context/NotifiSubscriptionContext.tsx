import type { Alert, ConnectedWallet } from '@notifi-network/notifi-core';
import { PropsWithChildren } from 'react';
import React, { createContext, useContext, useState } from 'react';

import { FetchedCardViewState, useFetchedCardState } from '../hooks';
import {
  IntercomCardView,
  useIntercomCardState,
} from '../hooks/useIntercomCardState';
import { NotifiParams } from './NotifiContext';
import {
  DestinationError,
  DestinationErrorMessageField,
  DestinationErrors,
} from './constants';

type ConfirmedDiscordTarget = {
  discriminator: string;
  isConfirmed: true;
  username: string;
  id: string;
};

type UnconfirmedDiscordTarget = {
  isConfirmed: false;
  id: string;
};

type DisplayDiscordTarget = ConfirmedDiscordTarget | UnconfirmedDiscordTarget;

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
  useDiscord: boolean;
  cardView: FetchedCardViewState;
  setCardView: React.Dispatch<React.SetStateAction<FetchedCardViewState>>;
  intercomCardView: IntercomCardView;
  setIntercomCardView: React.Dispatch<React.SetStateAction<IntercomCardView>>;
  setAlerts: (alerts: Record<string, Alert | undefined>) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setTelegramId: (telegramId: string) => void;
  setUseHardwareWallet: React.Dispatch<React.SetStateAction<boolean>>;
  setUseDiscord: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hasChatAlert: boolean;
  setHasChatAlert: (hasChatAlert: boolean) => void;
  conversationId: string;
  setConversationId: (conversationId: string) => void;
  userId: string;
  setUserId: (userId: string) => void;
  setEmailErrorMessage: (value: DestinationError) => void;
  setTelegramConfirmationUrl: (
    telegramConfirmationUrl: string | undefined,
  ) => void;
  setPhoneNumberErrorMessage: (value: DestinationError) => void;
  setDiscordErrorMessage: (value: DestinationError) => void;
  setTelegramErrorMessage: (value: DestinationError) => void;
  resetErrorMessageState: () => void;

  discordTargetData: DisplayDiscordTarget;
  setDiscordTargetData: React.Dispatch<
    React.SetStateAction<DisplayDiscordTarget>
  >;
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

  const [telegramConfirmationUrl, setTelegramConfirmationUrl] = useState<
    string | undefined
  >(undefined);

  const [alerts, setAlerts] = useState<Record<string, Alert | undefined>>({});
  const [connectedWallets, setConnectedWallets] = useState<
    ReadonlyArray<ConnectedWallet>
  >([]);
  const [useHardwareWallet, setUseHardwareWallet] = useState<boolean>(false);
  const [useDiscord, setUseDiscord] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [telegramId, setTelegramId] = useState<string>('');

  const [discordTargetData, setDiscordTargetData] =
    useState<DisplayDiscordTarget>({
      isConfirmed: false,
      id: '',
    });

  const [destinationErrorMessages, setDestinationErrorMessages] =
    useState<DestinationErrorMessages>({
      email: undefined,
      telegram: undefined,
      phoneNumber: undefined,
      discord: undefined,
    });

  const handleErrorMessage = ({
    field,
    value,
  }: DestinationErrorMessageField) => {
    setDestinationErrorMessages((destinationErrorMessages) => ({
      ...destinationErrorMessages,
      [field]: value,
    }));
  };

  const setEmailErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'email', value });
  };

  const setTelegramErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'telegram', value });
  };

  const setPhoneNumberErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'phoneNumber', value });
  };
  const setDiscordErrorMessage = (value: DestinationError) => {
    handleErrorMessage({ field: 'discord', value });
  };

  const resetErrorMessageState = () => {
    setDestinationErrorMessages({
      email: undefined,
      telegram: undefined,
      phoneNumber: undefined,
      discord: undefined,
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
    setDiscordErrorMessage,
    useDiscord,
    setUseDiscord,
    discordTargetData,
    setDiscordTargetData,
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
