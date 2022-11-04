import React from 'react';

import {
  NotifiSubscriptionContextProvider,
  useNotifiClientContext,
} from '../../context';
import type { NotifiFooterProps } from '../NotifiFooter';
import type { ErrorStateCardProps } from './ErrorStateCard';
import type { FetchedStateCardProps } from './FetchedStateCard';
import type { LoadingStateCardProps } from './LoadingStateCard';
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

export type NotifiInputLabels = {
  email?: string;
  sms?: string;
  telegram?: string;
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
