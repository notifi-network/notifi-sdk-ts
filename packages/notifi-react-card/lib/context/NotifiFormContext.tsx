import React, { createContext, useContext, useState } from 'react';

export type FormInputs = {
  email: string;
  phoneNumber: string;
  telegram: string;
  twitter: string;
  discord: string;
};

export type FormErrorMessages = FormInputs;

export type NotifiFormData = Readonly<{
  formState: FormInputs;
  formErrorMessages: FormErrorMessages;

  setEmail: (value: string) => void;
  setEmailErrorMessage: (value: string) => void;

  setPhoneNumber: (value: string) => void;
  setPhoneNumberErrorMessage: (value: string) => void;

  setTelegram: (value: string) => void;
  setTelegramErrorMessage: (value: string) => void;

  setDiscord: (value: string) => void;
  setDiscordErrorMessage: (value: string) => void;

  setTwitter: (value: string) => void;
  setTwitterErrorMessage: (value: string) => void;
}>;

export type FormField =
  | 'email'
  | 'phoneNumber'
  | 'telegram'
  | 'discord'
  | 'twitter';

export type EditFormType = {
  field: FormField;
  value: string;
};

const NotifiFormContext = createContext<NotifiFormData>({} as NotifiFormData);

export const NotifiFormProvider: React.FC = ({ children }) => {
  const [formState, setFormInput] = useState<FormInputs>({
    email: '',
    phoneNumber: '',
    telegram: '',
    twitter: '',
    discord: '',
  });

  const [formErrorMessages, setInputErrorMessage] = useState<FormErrorMessages>(
    {
      email: '',
      telegram: '',
      phoneNumber: '',
      discord: '',
      twitter: '',
    },
  );

  const handleFormInput = ({ field, value }: EditFormType) => {
    setFormInput((formErrorMessages) => ({
      ...formErrorMessages,
      [field]: value,
    }));
  };

  const handleErrorMessage = ({ field, value }: EditFormType) => {
    setInputErrorMessage((formErrorMessages) => ({
      ...formErrorMessages,
      [field]: value,
    }));
  };

  const setEmail = (value: string) => {
    handleFormInput({ field: 'email', value });
  };

  const setEmailErrorMessage = (value: string) => {
    handleErrorMessage({ field: 'email', value });
  };

  const setTelegram = (value: string) => {
    handleFormInput({ field: 'telegram', value });
  };

  const setTelegramErrorMessage = (value: string) => {
    handleErrorMessage({ field: 'telegram', value });
  };

  const setPhoneNumber = (value: string) => {
    handleFormInput({ field: 'phoneNumber', value });
  };

  const setPhoneNumberErrorMessage = (value: string) => {
    handleErrorMessage({ field: 'phoneNumber', value });
  };

  const setDiscord = (value: string) => {
    handleFormInput({ field: 'discord', value });
  };

  const setDiscordErrorMessage = (value: string) => {
    handleErrorMessage({ field: 'discord', value });
  };
  const setTwitter = (value: string) => {
    handleFormInput({ field: 'discord', value });
  };

  const setTwitterErrorMessage = (value: string) => {
    handleErrorMessage({ field: 'discord', value });
  };

  const value = {
    formState,
    formErrorMessages,
    setEmail,
    setEmailErrorMessage,
    setTelegram,
    setTelegramErrorMessage,
    setPhoneNumber,
    setPhoneNumberErrorMessage,
    setDiscord,
    setDiscordErrorMessage,
    setTwitter,
    setTwitterErrorMessage,
  };

  return (
    <NotifiFormContext.Provider value={value}>
      {children}
    </NotifiFormContext.Provider>
  );
};

export const useNotifiForm: () => NotifiFormData = () => {
  const data = useContext(NotifiFormContext);
  return data;
};
