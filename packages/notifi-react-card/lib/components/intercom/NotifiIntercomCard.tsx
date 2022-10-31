import clsx from 'clsx';
import React from 'react';

import { useIntercomCard } from '../../hooks/useIntercomCard';
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
}: React.PropsWithChildren<NotifiIntercomCardProps>) => {
  const card = useIntercomCard();
  let contents: React.ReactNode = null;

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
          card={card}
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
        'NotifiSubscriptionCard__container',
        classNames?.container,
      )}
    >
      <h1 className={clsx('NotifiIntercomCard__title', classNames?.title)}>
        {{ companySupportTitle }}
      </h1>
      <div
        className={clsx('NotifiIntercomCard__subtitle1', classNames?.subtitle1)}
      >
        {{ companySupportSubtitle }}
      </div>
      <div
        className={clsx('NotifiIntercomCard__subtitle2', classNames?.subtitle2)}
      >
        {{ companySupportDescription }}
      </div>
      {children}
      {contents}
      <NotifiStartChatButton classNames={classNames?.NotifiSubscribeButton} />
    </div>
  );
};
