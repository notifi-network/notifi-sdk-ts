import clsx from 'clsx';
import React from 'react';

import { useIntercomCard } from '../../hooks/useIntercomCard';
import { ErrorStateCard, LoadingStateCard } from '../common';
import { IntercomCard } from './IntercomCard';
import { NotifiIntercomCardProps } from './NotifiIntercomCard';

export const NotifiIntercomCardContainer: React.FC<
  React.PropsWithChildren<NotifiIntercomCardProps>
> = ({
  classNames,
  darkMode,
  inputLabels,
  inputs = {},
  inputSeparators,
  children,
  cardId,
}: React.PropsWithChildren<NotifiIntercomCardProps>) => {
  let contents: React.ReactNode = null;
  const card = useIntercomCard(cardId);

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
        <ErrorStateCard
          classNames={classNames?.ErrorStateCard}
          reason={card.reason}
        />
      );
      break;
    case 'fetched':
      contents = (
        <IntercomCard
          data={card.data}
          inputs={inputs}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          classNames={classNames}
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
      {children}
      {contents}
    </div>
  );
};
