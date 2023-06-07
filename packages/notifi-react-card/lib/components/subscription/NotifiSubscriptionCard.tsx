import clsx from 'clsx';
import {
  useNotifiSubscribe,
  useSubscriptionCard,
} from 'notifi-react-card/lib/hooks';
import React, { useMemo } from 'react';

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
  const { isInitialized } = useNotifiSubscribe({ targetGroupName: 'Default' });
  const {
    canary: { isActive: canaryIsActive, frontendClient },
  } = useNotifiClientContext();

  const isClientInitialized = useMemo(() => {
    return canaryIsActive ? !!frontendClient.userState : isInitialized;
  }, [frontendClient.userState?.status, isInitialized, canaryIsActive]);

  const { loading } = useNotifiSubscriptionContext();

  const inputDisabled = loading || !isClientInitialized;

  const card = useSubscriptionCard({
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
