import clsx from 'clsx';
import React, { useState } from 'react';
import { useSubscriptionCard } from '../../hooks';

import type { ErrorStateCardProps } from './ErrorStateCard';
import { ErrorStateCard } from './ErrorStateCard';
import { FetchedStateCard } from './FetchedStateCard';
import type { LoadingStateCardProps } from './LoadingStateCard';
import { LoadingStateCard } from './LoadingStateCard';
import type { NotifiStartChatButtonProps } from './NotifiStartChatButton';
import { NotifiStartChatButton } from './NotifiStartChatButton';

export type NotifiInputSeparators = {
  emailSeparator?: {
    classNames?: {
      container: string;
      content: string;
    };
    content: string;
  };
  smsSeparator?: {
    classNames?: {
      container: string;
      content: string;
    };
    content: string;
  };
  telegramSeparator?: {
    classNames?: {
      container: string;
      content: string;
    };
    content: string;
  };
};

export type NotifiInputLabels = {
  email?: string;
  sms?: string;
  telegram?: string;
};

export type NotifiIntercomCardProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    title?: string;
    subtitle1?: string;
    subtitle2?: string;
    ErrorStateCard?: ErrorStateCardProps['classNames'];
    LoadingStateCard?: LoadingStateCardProps['classNames'];
    NotifiSubscribeButton?: NotifiStartChatButtonProps['classNames'];
  }>;
  companySupportTitle?: string;
  companySupportSubtitle?: string;
  companySupportDescription?: string;
  inputLabels?: NotifiInputLabels;
  darkMode?: boolean;
  inputs?: Record<string, string | undefined>;
  inputSeparators?: NotifiInputSeparators;
  cardId: string;
}>;

export const NotifiIntercomCard: React.FC<
  React.PropsWithChildren<NotifiIntercomCardProps>
> = ({
  classNames,
  companySupportTitle,
  companySupportSubtitle,
  companySupportDescription,
  darkMode,
  inputLabels,
  inputs = {},
  inputSeparators,
  children,
  cardId,
}: React.PropsWithChildren<NotifiIntercomCardProps>) => {
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [telegramId, setTelegramId] = useState<string>('');

  const [emailErrorMessage, setEmailErrorMessage] = useState<string>('');
  const [smsErrorMessage, setSmsErrorMessage] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(true);
  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';
  const disabled =
    (email === '' && phoneNumber === '' && telegramId === '' && !checked) ||
    hasErrors;
  let contents: React.ReactNode = null;
  const card = useSubscriptionCard(cardId);

  companySupportTitle = companySupportTitle || 'Your Company Support';
  companySupportSubtitle =
    companySupportSubtitle ||
    'Start chatting with our team to get support. We’re here for you 24/7!';
  companySupportDescription =
    companySupportDescription || 'Get notifications for your support request';

  switch (card.state) {
    case 'loading':
      contents = (
        <LoadingStateCard
          classNames={classNames?.LoadingStateCard}
          card={card}
        />
      );
      break;
    case 'error':
      contents = (
        <ErrorStateCard classNames={classNames?.ErrorStateCard} card={card} />
      );
      break;
    case 'fetched':
      contents = (
        <FetchedStateCard
          checked={checked}
          setChecked={setChecked}
          email={email}
          setEmail={setEmail}
          emailErrorMessage={emailErrorMessage}
          setEmailErrorMessage={setEmailErrorMessage}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setSmsErrorMessage={setSmsErrorMessage}
          smsErrorMessage={smsErrorMessage}
          telegramId={telegramId}
          setTelegramId={setTelegramId}
          data={card.data}
          inputs={inputs}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
        />
      );
      break;
  }

  return (
    <div
      className={clsx(
        darkMode ? 'notifi__dark' : 'notifi__light',
        'NotifiIntercomCard__container',
        classNames?.container,
      )}
    >
      <h1 className={clsx('NotifiIntercomCard__title', classNames?.title)}>
        {companySupportTitle}
      </h1>
      <div
        className={clsx('NotifiIntercomCard__subtitle1', classNames?.subtitle1)}
      >
        {companySupportSubtitle}
      </div>
      <div
        className={clsx('NotifiIntercomCard__subtitle2', classNames?.subtitle2)}
      >
        {companySupportDescription}
      </div>
      {children}
      {contents}
      <NotifiStartChatButton
        disabled={disabled}
        classNames={classNames?.NotifiSubscribeButton}
      />
    </div>
  );
};
