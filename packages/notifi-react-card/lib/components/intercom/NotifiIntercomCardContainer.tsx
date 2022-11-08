import clsx from 'clsx';
import React, { useState } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { useSubscriptionCard } from '../../hooks';
import { ErrorStateCard } from './ErrorStateCard';
import { FetchedStateCard } from './FetchedStateCard';
import { LoadingStateCard } from './LoadingStateCard';
import { NotifiIntercomCardProps } from './NotifiIntercomCard';
import { NotifiIntercomChatWindowContainer } from './NotifiIntercomChatWindowContainer';
import { NotifiStartChatButton } from './NotifiStartChatButton';

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
  const [checked, setChecked] = useState<boolean>(true);
  const [startChat, setStartChat] = useState<boolean>(false);
  const { email, emailErrorMessage, phoneNumber, smsErrorMessage, telegramId } =
    useNotifiSubscriptionContext();

  const hasErrors = emailErrorMessage !== '' || smsErrorMessage !== '';
  const disabled =
    (email === '' && phoneNumber === '' && telegramId === '' && !checked) ||
    hasErrors;
  let contents: React.ReactNode = null;
  const card = useSubscriptionCard(cardId);

  const handleStartChatClick = () => {
    setStartChat(true);
  };

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
        startChat
          ? 'NotifiIntercomCard__chatWindowContainer'
          : 'NotifiIntercomCard__container',
        classNames?.container,
      )}
    >
      {startChat ? (
        <NotifiIntercomChatWindowContainer
          classNames={classNames?.NotifiIntercomChatWindowContainer}
        />
      ) : (
        <>
          <h1 className={clsx('NotifiIntercomCard__title', classNames?.title)}>
            {companySupportTitle}
          </h1>
          <div
            className={clsx(
              'NotifiIntercomCard__subtitle1',
              classNames?.subtitle1,
            )}
          >
            {companySupportSubtitle}
          </div>
          <div
            className={clsx(
              'NotifiIntercomCard__subtitle2',
              classNames?.subtitle2,
            )}
          >
            {companySupportDescription}
          </div>
          {children}
          {contents}
          <NotifiStartChatButton
            onClick={handleStartChatClick}
            disabled={disabled}
            classNames={classNames?.NotifiStartChatButton}
          />
        </>
      )}
    </div>
  );
};
