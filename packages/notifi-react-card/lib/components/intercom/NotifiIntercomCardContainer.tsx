import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
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
  const { intercomCardView } = useNotifiSubscriptionContext();

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
        />
      );
      break;
  }

  let names: (string | undefined)[] = [];
  switch (intercomCardView.state) {
    case 'chatWindowView':
      names = [
        'NotifiIntercomCard__chatWindowContainer',
        classNames?.chatWindowContainer,
      ];
      break;
    case 'startChatView':
      names = [
        'NotifiIntercomCard__startChatContainer',
        classNames?.startChatContainer,
      ];
      break;
    case 'settingView':
      names = [
        'NotifiIntercomCard__settingViewContainer',
        classNames?.settingViewContainer,
      ];
      break;
  }

  return (
    <div
      className={clsx(darkMode ? 'notifi__dark' : 'notifi__light', ...names)}
    >
      {children}
      {contents}
    </div>
  );
};
