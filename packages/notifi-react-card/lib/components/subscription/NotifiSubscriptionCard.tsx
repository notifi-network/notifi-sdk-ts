import React from 'react';

import {
  NotifiSubscriptionContextProvider,
  useNotifiClientContext,
} from '../../context';
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
  discordSeparator?: {
    classNames?: {
      container: string;
      content: string;
    };
    content: string;
  };
  twitterSeparator?: {
    classNames?: {
      container: string;
      content: string;
    };
    content: string;
  };
};

export type NotifiInputLabels = {
  email?: string;
  sms?: string;
  telegram?: string;
  discord?: string;
  twitter?: string;
};

export type NotifiSubscriptionCardProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    ErrorStateCard?: ErrorStateCardProps['classNames'];
    FetchedStateCard?: FetchedStateCardProps['classNames'];
    LoadingStateCard?: LoadingStateCardProps['classNames'];
    NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
    NotifiFooter?: NotifiFooterProps['classNames'];
  }>;
  buttonText?: string;
  hideAlertListPreview?: boolean;
  inputLabels?: NotifiInputLabels;
  darkMode?: boolean;
  cardId: string;
  inputs?: Record<string, string | undefined>;
  inputSeparators?: NotifiInputSeparators;
}>;

export const NotifiSubscriptionCard: React.FC<
  React.PropsWithChildren<NotifiSubscriptionCardProps>
> = (props: React.PropsWithChildren<NotifiSubscriptionCardProps>) => {
  const { params } = useNotifiClientContext();

  return (
    <NotifiSubscriptionContextProvider {...params}>
      <NotifiSubscriptionCardContainer {...props} />
    </NotifiSubscriptionContextProvider>
  );
};
