import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import React from 'react';

import { useSubscriptionCard } from '../../hooks';
import { ErrorStateCard } from './ErrorStateCard';
import { IntercomCard } from './IntercomCard';
import { LoadingStateCard } from './LoadingStateCard';
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
  const { intercomCardView } = useNotifiSubscriptionContext();

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
        <IntercomCard
          data={card.data}
          inputs={inputs}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          classNames={classNames}
          companySupportTitle={companySupportTitle}
          companySupportSubtitle={companySupportSubtitle}
          companySupportDescription={companySupportDescription}
        />
      );
      break;
  }

  return (
    <div
      className={clsx(
        darkMode ? 'notifi__dark' : 'notifi__light',
        intercomCardView.state === 'chatWindowView' ||
          intercomCardView.state === 'settingView'
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
