import clsx from 'clsx';
import React, { useState } from 'react';

import { useSubscriptionCard } from '../../hooks';
import { ErrorStateCard } from './ErrorStateCard';
import { LoadingStateCard } from './LoadingStateCard';
import { NotifiConsumerFTU } from './NotifiConsumerFTU';
import { NotifiIntercomCardProps } from './NotifiIntercomCard';

export const NotifiIntercomCardContainer: React.FC<
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
  const [startChat, setStartChat] = useState<boolean>(false);

  let contents: React.ReactNode = null;
  const card = useSubscriptionCard(cardId);

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
        <NotifiConsumerFTU
          data={card.data}
          inputs={inputs}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          classNames={classNames}
          companySupportTitle={companySupportTitle}
          companySupportSubtitle={companySupportSubtitle}
          companySupportDescription={companySupportDescription}
          startChat={startChat}
          setStartChat={setStartChat}
        />
      );
      break;
  }

  return (
    <div
      className={clsx(
        darkMode ? 'notifi__dark' : 'notifi__light',
        startChat
          ? 'NotifiIntercomCard__chatWindowContainer'
          : 'NotifiIntercomCard__container',
        classNames?.container,
      )}
    >
      {children}
      {contents}
    </div>
  );
};
