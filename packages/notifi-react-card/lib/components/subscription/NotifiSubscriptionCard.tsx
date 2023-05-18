import React from 'react';

import {
  NotifiFormProvider,
  NotifiSubscriptionContextProvider,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import { DeepPartialReadonly } from '../../utils';
import type { NotifiFooterProps } from '../NotifiFooter';
import type { LoadingStateCardProps } from '../common';
import type { ErrorStateCardProps } from '../common/ErrorStateCard';
import type { FetchedStateCardProps } from './FetchedStateCard';
import type { NotifiSubscribeButtonProps } from './NotifiSubscribeButton';
import { NotifiSubscriptionCardContainer } from './NotifiSubscriptionCardContainer';

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
> = (props: React.PropsWithChildren<NotifiSubscriptionCardProps>) => {
  const { params } = useNotifiClientContext();
  const { contextId } = useNotifiSubscriptionContext();
  // NOTE: This allows the card to be used with contexts outside of the card.
  // The context already exists at this point
  if (contextId) {
    return <NotifiSubscriptionCardContainer {...props} />;
  }

  return (
    <NotifiFormProvider>
      <NotifiSubscriptionContextProvider {...params}>
        <NotifiSubscriptionCardContainer {...props} />
      </NotifiSubscriptionContextProvider>
    </NotifiFormProvider>
  );
};
