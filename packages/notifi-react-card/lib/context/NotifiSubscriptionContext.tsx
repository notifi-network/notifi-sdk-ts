import type { AlertConfiguration } from '../utils';
import type { Alert } from '@notifi-network/notifi-core';
import type {
  MessageSigner,
  NotifiEnvironment,
} from '@notifi-network/notifi-react-hooks';
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export type NotifiParams = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration | null>;
  dappAddress: string;
  env: NotifiEnvironment;
  signer: MessageSigner;
  walletPublicKey: string;
  keepSubscriptionData?: boolean;
}>;

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert | undefined>>;
  email: string;
  params: NotifiParams;
  phoneNumber: string;
  isInitialized: boolean;
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
  setIsInitialized: (isInitialized: boolean) => void;
  setPhoneNumber: (phoneNumber: string) => void;
}>;

const NotifiSubscriptionContext = createContext<NotifiSubscriptionData>(
  {} as unknown as NotifiSubscriptionData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

export const NotifiSubscriptionContextProvider: React.FC<NotifiParams> = ({
  children,
  ...params
}: React.PropsWithChildren<NotifiParams>) => {
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [alerts, setAlerts] = useState<Record<string, Alert | undefined>>({});

  // TODO: let notifi client play better with the context so we don't have to redefine these states
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

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
    email,
    isInitialized,
    params,
    phoneNumber,
    getAlertConfiguration,
    getAlertConfigurations,
    setAlerts,
    setAlertConfiguration,
    setEmail,
    setIsInitialized,
    setPhoneNumber,
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
