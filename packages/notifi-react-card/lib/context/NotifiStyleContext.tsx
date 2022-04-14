import { DeepPartialReadonly } from '../utils';
import React, { createContext, useContext } from 'react';

export type NotifiStyleData = DeepPartialReadonly<{
  iconInput: {
    container: string;
    iconSpan: string;
    input: string;
  };
  smsInput: {
    countryCodeSpan: string;
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
