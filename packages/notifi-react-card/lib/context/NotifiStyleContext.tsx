import React, { createContext, useContext } from 'react';
import { DeepPartialReadonly } from '../utils';

export type NotifiStyleData = DeepPartialReadonly<{
  card: {
    container: string;
  };
  emailInput: {
    container: string;
    iconSpan: string;
    iconSvg: string;
    input: string;
  };
  footer: {
    container: string;
    poweredBy: string;
    logoSvg: string;
    link: string;
    spacer: string;
  };
  smsInput: {
    container: string;
    countryCodeSpan: string;
    iconSpan: string;
    iconSvg: string;
    input: string;
  };
  subscribeButton: {
    container: string;
    button: string;
  };
}>;

const NotifiStyleContext = createContext<NotifiStyleData>({});

export const NotifiStyleContextProvider: React.FC<NotifiStyleData> = ({
  children,
  ...styles
}: React.PropsWithChildren<NotifiStyleData>) => {
  return <NotifiStyleContext.Provider value={styles}>{children}</NotifiStyleContext.Provider>;
};

export const useNotifiStyleContext: () => NotifiStyleData = () => {
  const data = useContext(NotifiStyleContext);
  return data;
};
