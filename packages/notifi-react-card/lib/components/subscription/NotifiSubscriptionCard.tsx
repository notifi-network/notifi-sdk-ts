import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscribe, useSubscriptionCard } from '../../hooks';
import type { NotifiFooterProps } from '../NotifiFooter';
import { NotifiFooter } from '../NotifiFooter';
import type { ErrorStateCardProps } from './ErrorStateCard';
import { ErrorStateCard } from './ErrorStateCard';
import type { FetchedStateCardProps } from './FetchedStateCard';
import { FetchedStateCard } from './FetchedStateCard';
import type { LoadingStateCardProps } from './LoadingStateCard';
import { LoadingStateCard } from './LoadingStateCard';
import type { NotifiSubscribeButtonProps } from './NotifiSubscribeButton';
import { NotifiSubscribeButton } from './NotifiSubscribeButton';
import './defaults.css';

export type NotifiSubscriptionCardProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    ErrorStateCard?: ErrorStateCardProps['classNames'];
    FetchedStateCard?: FetchedStateCardProps['classNames'];
    LoadingStateCard?: LoadingStateCardProps['classNames'];
    NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
    NotifiFooter?: NotifiFooterProps['classNames'];
  }>;
  darkMode?: boolean;
  cardId: string;
  inputs?: Record<string, string | undefined>;
}>;

export const NotifiSubscriptionCard: React.FC<NotifiSubscriptionCardProps> = ({
  classNames,
  cardId,
  darkMode,
  inputs = {},
}: NotifiSubscriptionCardProps) => {
  const { loading, isAuthenticated, isInitialized } = useNotifiSubscribe();
  const inputDisabled = loading || !isAuthenticated || !isInitialized;

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
        />
      );
      break;
  }

  return (
    <div
      className={clsx(
        'NotifiSubscriptionCard__container',
        darkMode ? 'notifi__dark' : 'notifi__light',
        classNames?.container,
      )}
    >
      {contents}
      <NotifiSubscribeButton classNames={classNames?.NotifiSubscribeButton} />
      <NotifiFooter classNames={classNames?.NotifiFooter} />
    </div>
  );
};
