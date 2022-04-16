import { DeepPartialReadonly } from '../utils';
import React, { createContext, useContext } from 'react';

export type NotifiCopyData = DeepPartialReadonly<{
  emailInput: {
    placeholder: string;
  };
  footer: {
    poweredBy: string;
    learnMore: string;
  };
  smsInput: {
    placeholder: string;
  };
  subscribeButton: {
    subscribe: string;
  };
}>;

const NotifiCopyContext = createContext<NotifiCopyData>({});

export const NotifiCopyContextProvider: React.FC<NotifiCopyData> = ({
  children,
  ...copy
}: React.PropsWithChildren<NotifiCopyData>) => {
  return (
    <NotifiCopyContext.Provider value={copy}>
      {children}
    </NotifiCopyContext.Provider>
  );
};

export const useNotifiCopyContext: () => NotifiCopyData = () => {
  const data = useContext(NotifiCopyContext);
  return data;
};
