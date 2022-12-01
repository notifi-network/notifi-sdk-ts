import React from 'react';

import {
  NotifiSubscriptionContextProvider,
  useNotifiClientContext,
} from '../../context';
import type { ErrorStateCardProps } from '../common';
import type { LoadingStateCardProps } from '../common';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from '../subscription/NotifiSubscriptionCard';
import { NotifiIntercomCardContainer } from './NotifiIntercomCardContainer';
import { NotifiIntercomChatWindowContainerProps } from './NotifiIntercomChatWindowContainer';
import type { NotifiStartChatButtonProps } from './NotifiStartChatButton';
import { SettingHeaderProps } from './SettingHeader';

export type NotifiIntercomCardProps = Readonly<{
  classNames?: Readonly<{
    chatWindowContainer?: string;
    startChatContainer?: string;
    settingViewContainer?: string;
    title?: string;
    subtitle1?: string;
    subtitle2?: string;
    ErrorStateCard?: ErrorStateCardProps['classNames'];
    LoadingStateCard?: LoadingStateCardProps['classNames'];
    NotifiStartChatButton?: NotifiStartChatButtonProps['classNames'];
    NotifiIntercomChatWindowContainer?: NotifiIntercomChatWindowContainerProps['classNames'];
    NotifiIntercomSettingHeader: SettingHeaderProps['classNames'];
    errorMessage: string;
  }>;
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
