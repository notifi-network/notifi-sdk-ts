import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { useNotifiSubscribe, useSubscriptionCard } from '../../hooks';
import type { NotifiFooterProps } from '../NotifiFooter';
import { NotifiFooter } from '../NotifiFooter';
import type { ErrorStateCardProps } from './ErrorStateCard';
import { ErrorStateCard } from './ErrorStateCard';
import type { FetchedStateCardProps } from './FetchedStateCard';
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
    FetchedStateCard?: FetchedStateCardProps['classNames'];
    LoadingStateCard?: LoadingStateCardProps['classNames'];
    NotifiSubscribeButton?: NotifiStartChatButtonProps['classNames'];
    NotifiFooter?: NotifiFooterProps['classNames'];
  }>;
  inputLabels?: NotifiInputLabels;
  darkMode?: boolean;
  cardId: string;
  inputs?: Record<string, string | undefined>;
  inputSeparators?: NotifiInputSeparators;
}>;

export const NotifiIntercomCard: React.FC<
  React.PropsWithChildren<NotifiIntercomCardProps>
> = ({
  classNames,
  cardId,
  darkMode,
  inputLabels,
  inputs = {},
  inputSeparators,
  children,
}: React.PropsWithChildren<NotifiIntercomCardProps>) => {
  const { isInitialized } = useNotifiSubscribe();
  const { loading } = useNotifiSubscriptionContext();
  const inputDisabled = loading || !isInitialized;

  const card = useSubscriptionCard(cardId);
  let contents: React.ReactNode = null;

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
          classNames={classNames?.FetchedStateCard}
          card={card}
          inputs={inputs}
          inputDisabled={inputDisabled}
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
        Your Company Support
      </h1>
      <div
        className={clsx('NotifiIntercomCard__subtitle1', classNames?.subtitle1)}
      >
        Start chatting with our team to get support. We’re here for you 24/7!
      </div>
      <div
        className={clsx('NotifiIntercomCard__subtitle2', classNames?.subtitle2)}
      >
        Get notifications for your support request
      </div>
      {children}
      {contents}
      <NotifiStartChatButton classNames={classNames?.NotifiSubscribeButton} />
    </div>
  );
};
