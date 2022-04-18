import type { Alert, FilterOptions } from '@notifi-network/notifi-core';
import type { CountryCode } from 'libphonenumber-js';
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

export type AlertConfiguration = Readonly<{
  sourceType: string;
  filterType: string;
  filterOptions: FilterOptions | null;
}>;

export type NotifiSubscriptionData = Readonly<{
  alerts: Readonly<Record<string, Alert | undefined>>;
  countryCode: CountryCode;
  email: string;
  phoneNumber: string;
  getAlertConfiguration: (name: string) => AlertConfiguration | null;
  getAlertConfigurations: () => Readonly<Record<string, AlertConfiguration>>;
  setAlerts: (alerts: Record<string, Alert | undefined>) => void;
  setAlertConfiguration: (
    name: string,
    config: AlertConfiguration | null,
  ) => void;
  setCountryCode: (countryCode: CountryCode) => void;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
}>;

const NotifiSubscriptionContext = createContext<NotifiSubscriptionData>(
  {} as unknown as NotifiSubscriptionData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

type Props = Readonly<{
  alertConfigurations?: Record<string, AlertConfiguration>;
}>;

export const NotifiSubscriptionContextProvider: React.FC<Props> = ({
  alertConfigurations: initialConfigs,
  children,
}) => {
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [countryCode, setCountryCode] = useState<CountryCode>('US');
  const [alerts, setAlerts] = useState<Record<string, Alert | undefined>>({});

  const alertConfigurations = useRef<Record<string, AlertConfiguration>>(
    initialConfigs ?? {},
  );
  const getAlertConfigurations = useCallback((): Readonly<
    Record<string, AlertConfiguration>
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
        delete alertConfigurations.current[name];
      } else {
        alertConfigurations.current[name] = config;
      }
    },
    [],
  );

  const value = {
    alerts,
    countryCode,
    email,
    phoneNumber,
    getAlertConfiguration,
    getAlertConfigurations,
    setAlerts,
    setAlertConfiguration,
    setCountryCode,
    setEmail,
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
