import clsx from 'clsx';
import React, { useEffect } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import {
  FetchedState,
  SubscriptionCardState,
  useNotifiSubscribe,
  useSubscriptionCard,
} from '../../hooks';
import { NotifiFooter } from '../NotifiFooter';
import { ErrorStateCard, LoadingStateCard } from '../common';
import { FetchedStateCard } from './FetchedStateCard';
import { NotifiSubscriptionCardProps } from './NotifiSubscriptionCard';

export const NotifiSubscriptionCardContainer: React.FC<
  React.PropsWithChildren<NotifiSubscriptionCardProps>
> = ({
  classNames,
  copy,
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
  demoByJSONConfig,
}: React.PropsWithChildren<NotifiSubscriptionCardProps>) => {
  const subscribe = demoByJSONConfig
    ? null
    : useNotifiSubscribe({ targetGroupName: 'Default' });
  const { loading, setDemoPreview } = useNotifiSubscriptionContext();

  useEffect(() => {
    demoByJSONConfig ? setDemoPreview(demoByJSONConfig) : setDemoPreview(null);
  }, [demoByJSONConfig]);

  const inputDisabled = loading || !subscribe?.isInitialized;

  const card: SubscriptionCardState = demoByJSONConfig
    ? ({ state: 'fetched', data: demoByJSONConfig.data } as FetchedState)
    : useSubscriptionCard({
        id: cardId,
        type: 'SUBSCRIPTION_CARD',
      });

  let contents: React.ReactNode = null;

  switch (card.state) {
    case 'loading':
      contents = (
        <LoadingStateCard
          copy={copy?.LoadingStateCard}
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
          copy={copy?.ErrorStateCard}
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
          copy={copy?.FetchedStateCard}
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
