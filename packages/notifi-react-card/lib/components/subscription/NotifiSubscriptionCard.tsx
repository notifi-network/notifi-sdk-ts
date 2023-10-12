import clsx from 'clsx';
import {
  useNotifiSubscribe,
  useSubscriptionCard,
} from 'notifi-react-card/lib/hooks';
import React, { useEffect, useMemo } from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import { DeepPartialReadonly } from '../../utils';
import { NotifiFooter, NotifiFooterProps } from '../NotifiFooter';
import { LoadingStateCard, LoadingStateCardProps } from '../common';
import { ErrorStateCard, ErrorStateCardProps } from '../common/ErrorStateCard';
import { FetchedStateCard, FetchedStateCardProps } from './FetchedStateCard';
import type { NotifiSubscribeButtonProps } from './NotifiSubscribeButton';

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

export type NotifiInputFieldsText = {
  label?: {
    email?: string;
    sms?: string;
    telegram?: string;
  };
  placeholderText?: { email?: string; sms?: string; telegram?: string };
};

export type NotifiSubscriptionCardProps = Readonly<{
  copy?: DeepPartialReadonly<{
    ErrorStateCard: ErrorStateCardProps['copy'];
    FetchedStateCard: FetchedStateCardProps['copy'];
    LoadingStateCard: LoadingStateCardProps['copy'];
  }>;
  classNames?: Readonly<{
    container?: string;
    ErrorStateCard?: ErrorStateCardProps['classNames'];
    FetchedStateCard?: FetchedStateCardProps['classNames'];
    LoadingStateCard?: LoadingStateCardProps['classNames'];
    NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
    NotifiFooter?: NotifiFooterProps['classNames'];
  }>;
  loadingSpinnerSize?: string;
  loadingRingColor?: string;
  disclosureCopy?: string;
  inputLabels?: NotifiInputFieldsText;
  darkMode?: boolean;
  cardId: string;
  inputs?: Record<string, unknown>;
  inputSeparators?: NotifiInputSeparators;
  onClose?: () => void;
}>;

export const NotifiSubscriptionCard: React.FC<
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
}) => {
  const { isInitialized, reload, isAuthenticated } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });
  const { isUsingFrontendClient, frontendClient } = useNotifiClientContext();

  const { isClientInitialized, isClientAuthenticated } = useMemo(() => {
    return {
      isClientInitialized: isUsingFrontendClient
        ? !!frontendClient.userState
        : isInitialized,
      isClientAuthenticated: isUsingFrontendClient
        ? frontendClient.userState?.status === 'authenticated'
        : isAuthenticated,
    };
  }, [
    isUsingFrontendClient,
    isInitialized,
    frontendClient.userState?.status,
    isAuthenticated,
  ]);

  const { loading, render } = useNotifiSubscriptionContext();

  const inputDisabled = loading || !isClientInitialized;

  const card = useSubscriptionCard({
    id: cardId,
    type: 'SUBSCRIPTION_CARD',
  });

  let contents: React.ReactNode = null;

  useEffect(() => {
    const handler = () => {
      // Ensure target is up-to-date after user returns to tab from 3rd party verification site
      if (!isClientInitialized || !isClientAuthenticated) {
        return;
      }
      if (isUsingFrontendClient) {
        return frontendClient.fetchData().then(render);
      }
      reload();
    };

    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('focus', handler);
    };
  }, [
    isClientInitialized,
    isAuthenticated,
    isClientAuthenticated,
    isUsingFrontendClient,
    frontendClient,
  ]);

  switch (card.state) {
    case 'loading':
      contents = (
        <LoadingStateCard
          copy={copy?.LoadingStateCard}
          spinnerSize={loadingSpinnerSize}
          ringColor={loadingRingColor}
          classNames={classNames?.LoadingStateCard}
          onClose={onClose}
        />
      );
      break;
    case 'error':
      contents = (
        <ErrorStateCard
          copy={copy?.ErrorStateCard}
          classNames={classNames?.ErrorStateCard}
          reason={card.reason}
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
