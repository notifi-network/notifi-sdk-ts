import { DeepPartialReadonly } from '../utils';
import React, { createContext, useContext } from 'react';

export type NotifiStyleData = DeepPartialReadonly<{
  emailInput: {
    container: string;
    iconSpan: string;
    iconSvg: string;
    input: string;
  };
  smsInput: {
    container: string;
    countryCodeSpan: string;
    iconSpan: string;
    iconSvg: string;
    input: string;
  };
}>;

const NotifiStyleContext = createContext<NotifiStyleData>({});

export const NotifiStyleContextProvider: React.FC<NotifiStyleData> = ({
  children,
  ...styles
}: React.PropsWithChildren<NotifiStyleData>) => {
  return (
    <NotifiStyleContext.Provider value={styles}>
      {children}
    </NotifiStyleContext.Provider>
  );
};

export const useNotifiStyleContext: () => NotifiStyleData = () => {
  const data = useContext(NotifiStyleContext);
  return data;
};
