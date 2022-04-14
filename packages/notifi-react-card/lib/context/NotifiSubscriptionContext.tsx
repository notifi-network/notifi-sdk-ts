import React, { createContext, useContext, useState } from 'react';

export type NotifiSubscriptionData = Readonly<{
  email: string;
  phoneNumber: string;
  setEmail: (email: string) => void;
  setPhoneNumber: (phoneNumber: string) => void;
}>;

const NotifiSubscriptionContext = createContext<NotifiSubscriptionData>(
  {} as unknown as NotifiSubscriptionData, // Intentially empty in default, use NotifiSubscriptionContextProvider
);

export const NotifiSubscriptionContextProvider: React.FC = ({ children }) => {
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const value = {
    email,
    phoneNumber,
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
