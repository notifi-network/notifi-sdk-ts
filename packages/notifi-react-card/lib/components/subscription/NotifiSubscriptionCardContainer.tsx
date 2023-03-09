import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { useNotifiSubscribe, useSubscriptionCard } from '../../hooks';
import { NotifiFooter } from '../NotifiFooter';
import { ErrorStateCard, LoadingStateCard } from '../common';
import { FetchedStateCard } from './FetchedStateCard';
import { NotifiSubscriptionCardProps } from './NotifiSubscriptionCard';

export const NotifiSubscriptionCardContainer: React.FC<
  React.PropsWithChildren<NotifiSubscriptionCardProps>
> = ({
  classNames,
  cardId,
  darkMode,
  inputLabels,
  inputs = {},
  inputSeparators,
  disclosureCopy,
  children,
  loadingRingColor,
  loadingSpinnerSize,
  onClose,
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
          spinnerSize={loadingSpinnerSize}
          ringColor={loadingRingColor}
          classNames={classNames?.LoadingStateCard}
          card={card}
          onClose={onClose}
        />
      );
      break;
    case 'error':
      contents = (
        <ErrorStateCard
          classNames={classNames?.ErrorStateCard}
          card={card}
          onClose={onClose}
        />
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
          onClose={onClose}
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
      <NotifiFooter
        classNames={classNames?.NotifiFooter}
        copy={{ disclosure: disclosureCopy }}
      />
    </div>
  );
};
