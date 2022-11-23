import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { useNotifiSubscribe, useSubscriptionCard } from '../../hooks';
import { NotifiFooter } from '../NotifiFooter';
import { ErrorStateCard } from './ErrorStateCard';
import { FetchedStateCard } from './FetchedStateCard';
import { LoadingStateCard } from './LoadingStateCard';
import { NotifiSubscriptionCardProps } from './NotifiSubscriptionCard';

export const NotifiSubscriptionCardContainer: React.FC<
  React.PropsWithChildren<NotifiSubscriptionCardProps>
> = ({
  buttonText,
  classNames,
  cardId,
  darkMode,
  inputLabels,
  inputs = {},
  inputSeparators,
  children,
}: React.PropsWithChildren<NotifiSubscriptionCardProps>) => {
  const { isInitialized } = useNotifiSubscribe({ targetGroupName: 'Default' });
  const { loading } = useNotifiSubscriptionContext();
  const inputDisabled = loading || !isInitialized;

  const card = useSubscriptionCard({
    id: cardId,
    type: 'SUBSCRIPTION_CARD',
  });
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
          buttonText={buttonText}
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
      {children}
      {contents}
      <NotifiFooter classNames={classNames?.NotifiFooter} />
    </div>
  );
};
