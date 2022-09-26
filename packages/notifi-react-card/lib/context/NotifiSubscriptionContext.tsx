import type { Alert } from '@notifi-network/notifi-core';
import {
  MessageSigner,
  NotifiEnvironment,
  useNotifiClient,
} from '@notifi-network/notifi-react-hooks';
import type { WalletContextState } from '@solana/wallet-adapter-react';
import type { Connection } from '@solana/web3.js';
import type { PropsWithChildren } from 'react';
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import type { AlertConfiguration } from '../utils';

export type NotifiParams = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration | null>;
  dappAddress: string;
  env: NotifiEnvironment;
  signer: MessageSigner;
  walletPublicKey: string;
  walletBlockchain: 'SOLANA' | 'ETHEREUM';
  keepSubscriptionData?: boolean;
  connection: Connection;
  sendTransaction: WalletContextState['sendTransaction'];
}>;

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert | undefined>>;
  client: ReturnType<typeof useNotifiClient>;
  email: string;
  params: NotifiParams;
  phoneNumber: string;
  telegramId: string;
  telegramConfirmationUrl?: string;
  useHardwareWallet: boolean;
  getAlertConfiguration: (name: string) => AlertConfiguration | null;
  getAlertConfigurations: () => Readonly<
    Record<string, AlertConfiguration | null>
  >;
  setAlerts: (alerts: Record<string, Alert | undefined>) => void;
  setAlertConfiguration: (
    name: string,
    config: AlertConfiguration | null,
  ) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
  setTelegramId: (telegramId: string) => void;
  setTelegramConfirmationUrl: (
    telegramConfirmationUrl: string | undefined,
  ) => void;
  setUseHardwareWallet: (hardwareWallet: boolean) => void;
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
  const [telegramConfirmationUrl, setTelegramConfirmationUrl] = useState<
    string | undefined
  >(undefined);
  const [alerts, setAlerts] = useState<Record<string, Alert | undefined>>({});
  const [useHardwareWallet, setUseHardwareWallet] = useState<boolean>(false);

  const { dappAddress, env, walletPublicKey, walletBlockchain } = params;
  const client = useNotifiClient({
    dappAddress,
    env,
    walletPublicKey,
    walletBlockchain,
  });

  const alertConfigurations = useRef<Record<string, AlertConfiguration | null>>(
    params.alertConfigurations ?? {},
  );
  const getAlertConfigurations = useCallback((): Readonly<
    Record<string, AlertConfiguration | null>
  > => {
    return alertConfigurations.current;
  }, []);

  const getAlertConfiguration = useCallback(
    (name: string): AlertConfiguration | null => {
      return alertConfigurations.current[name] ?? null;
    },
    [],
  );

  const setAlertConfiguration = useCallback(
    (name: string, config: AlertConfiguration | null): void => {
      if (config === null) {
        alertConfigurations.current[name] = null;
      } else {
        alertConfigurations.current[name] = config;
      }
    },
    [],
  );

  const value = {
    alerts,
    client,
    email,
    params,
    phoneNumber,
    telegramId,
    telegramConfirmationUrl,
    useHardwareWallet,
    getAlertConfiguration,
    getAlertConfigurations,
    setAlerts,
    setAlertConfiguration,
    setEmail,
    setPhoneNumber,
    setTelegramId,
    setTelegramConfirmationUrl,
    setUseHardwareWallet,
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
