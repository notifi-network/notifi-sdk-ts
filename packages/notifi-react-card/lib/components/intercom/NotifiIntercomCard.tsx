import React from 'react';

import {
  NotifiSubscriptionContextProvider,
  useNotifiClientContext,
} from '../../context';
import type { ErrorStateCardProps } from './ErrorStateCard';
import type { LoadingStateCardProps } from './LoadingStateCard';
import { NotifiIntercomCardContainer } from './NotifiIntercomCardContainer';
import type { NotifiStartChatButtonProps } from './NotifiStartChatButton';

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

export type NotifiIntercomCardProps = Readonly<{
  classNames?: Readonly<{
    container?: string;
    title?: string;
    subtitle1?: string;
    subtitle2?: string;
    ErrorStateCard?: ErrorStateCardProps['classNames'];
    LoadingStateCard?: LoadingStateCardProps['classNames'];
    NotifiSubscribeButton?: NotifiStartChatButtonProps['classNames'];
  }>;
  companySupportTitle?: string;
  companySupportSubtitle?: string;
  companySupportDescription?: string;
  inputLabels?: NotifiInputLabels;
  darkMode?: boolean;
  inputs?: Record<string, string | undefined>;
  inputSeparators?: NotifiInputSeparators;
  cardId: string;
}>;

export const NotifiIntercomCard: React.FC<
  React.PropsWithChildren<NotifiIntercomCardProps>
> = (props: React.PropsWithChildren<NotifiIntercomCardProps>) => {
  const { params } = useNotifiClientContext();

  return (
    <NotifiSubscriptionContextProvider {...params}>
      <NotifiIntercomCardContainer {...props} />
    </NotifiSubscriptionContextProvider>
  );
};
