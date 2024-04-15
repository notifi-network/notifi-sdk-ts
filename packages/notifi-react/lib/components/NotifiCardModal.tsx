import clsx from 'clsx';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React, { useEffect, useState } from 'react';

import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiUserSettingContext,
} from '../context';
import { useGlobalStateContext } from '../context/GlobalStateContext';
import { Connect, ConnectProps } from './Connect';
import { ErrorGlobal, ErrorGlobalProps } from './ErrorGlobal';
import { Expiry, ExpiryProps } from './Expiry';
import { Ftu } from './Ftu';
import { Inbox } from './Inbox';
import { LoadingGlobal, LoadingGlobalProps } from './LoadingGlobal';

// TODO: Deprecate this
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

export type NotifiCardModalProps = Readonly<{
  copy?: DeepPartialReadonly<{
    // ErrorStateCard: ErrorStateCardProps['copy'];
    // FetchedStateCard: FetchedStateCardProps['copy'];
    // LoadingStateCard: LoadingStateCardProps['copy'];
    ErrorGlobal: ErrorGlobalProps['copy'];
    LoadingGlobal: LoadingGlobalProps['copy'];
    Connect: ConnectProps['copy'];
    Expiry: ExpiryProps['copy'];
  }>;
  classNames?: Readonly<{
    container?: string;
    Connect?: ConnectProps['classNames'];
    Expiry?: ExpiryProps['classNames'];
    // ErrorStateCard?: ErrorStateCardProps['classNames'];
    // FetchedStateCard?: FetchedStateCardProps['classNames'];
    // LoadingStateCard?: LoadingStateCardProps['classNames'];
    // NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
    // NotifiFooter?: NotifiFooterProps['classNames'];
  }>;
  // loadingSpinnerSize?: string;
  // loadingRingColor?: string;
  // disclosureCopy?: string;
  // inputLabels?: NotifiInputFieldsText;
  darkMode?: boolean;
  // cardId: string;
  // inputs?: Record<string, unknown>;
  // inputSeparators?: NotifiInputSeparators;
  onClose?: () => void;
}>;

type CardModalView = 'connect' | 'expiry' | 'ftu' | 'Inbox';

export const NotifiCardModal: React.FC<NotifiCardModalProps> = (props) => {
  const {
    frontendClientStatus,
    isLoading: isLoadingClient,
    error: clientError,
  } = useNotifiFrontendClientContext();
  const {
    ftuStage,
    isLoading: isLoadingFtu,
    error: userSettingError,
  } = useNotifiUserSettingContext();
  const [CardModalView, setCardModalView] = useState<CardModalView | null>(
    null,
  );
  const {
    setGlobalLoading,
    setGlobalError,
    globalLoading,
    globalError,
    setGlobalCtas,
  } = useGlobalStateContext();
  const [error, setError] = useState<Error | null>(null);

  if (props.onClose) {
    setGlobalCtas({ onClose: props.onClose });
  }

  useEffect(() => {
    if (frontendClientStatus.isAuthenticated) {
      if (!ftuStage || (!!ftuStage && ftuStage !== FtuStage.Done)) {
        setCardModalView('ftu');
        return;
      }
      setCardModalView('Inbox');
      return;
    }
    if (frontendClientStatus.isExpired) {
      setCardModalView('expiry');
      return;
    }
    if (frontendClientStatus.isInitialized) {
      setCardModalView('connect');
      return;
    }
    setError(new Error('ERROR: Failed to load client'));
  }, [frontendClientStatus, ftuStage]);

  useEffect(() => {
    if (isLoadingClient || isLoadingFtu) {
      setGlobalLoading({ isLoading: true });
      return;
    }
    setGlobalLoading({ isLoading: false });
  }, [isLoadingClient, isLoadingFtu]);

  useEffect(() => {
    if (clientError || userSettingError || error) {
      setGlobalError({
        error: new Error(
          'ERROR: Failed to load client or user settings, please try again',
        ),
      });
      return;
    }
    setGlobalError(null);
  }, [userSettingError, error]);

  if (globalError || globalLoading.isLoading) {
    return (
      <div
        className={clsx(
          props.darkMode ? 'notifi-theme-dark' : 'notifi-theme-light',
          'notifi-card-modal',
          props.classNames?.container,
        )}
      >
        {globalLoading.isLoading ? <LoadingGlobal /> : null}
        {globalError ? <ErrorGlobal /> : null}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        props.darkMode ? 'notifi-theme-dark' : 'notifi-theme-light',
        'notifi-card-modal',
        props.classNames?.container,
      )}
    >
      {CardModalView === 'connect' ? (
        <Connect
          copy={props.copy?.Connect}
          classNames={props.classNames?.Connect}
        />
      ) : null}
      {CardModalView === 'expiry' ? (
        <Expiry
          copy={props.copy?.Expiry}
          classNames={props.classNames?.Expiry}
        />
      ) : null}
      {CardModalView === 'ftu' ? <Ftu /> : null}
      {CardModalView === 'Inbox' ? <Inbox /> : null}
    </div>
  );
};
