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
import { Ftu, FtuProps } from './Ftu';
import { Inbox } from './Inbox';
import { LoadingGlobalProps } from './LoadingGlobal';

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
    ErrorGlobal?: ErrorGlobalProps['copy'];
    LoadingGlobal?: LoadingGlobalProps['copy'];
    Connect?: ConnectProps['copy'];
    Expiry?: ExpiryProps['copy'];
    Ftu?: FtuProps['copy'];
  }>;
  classNames?: Readonly<{
    container?: string;
    Connect?: ConnectProps['classNames'];
    Expiry?: ExpiryProps['classNames'];
    Ftu?: FtuProps['classNames'];
  }>;
  darkMode?: boolean;
  onClose?: () => void;
}>;

type CardModalView = 'connect' | 'expiry' | 'ftu' | 'Inbox';

export const NotifiCardModal: React.FC<NotifiCardModalProps> = (props) => {
  const { frontendClientStatus, error: clientError } =
    useNotifiFrontendClientContext();
  const { ftuStage, error: userSettingError } = useNotifiUserSettingContext();
  const [CardModalView, setCardModalView] = useState<CardModalView | null>(
    null,
  );
  const { setGlobalError, globalError, setGlobalCtas } =
    useGlobalStateContext();
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

  if (globalError) {
    return <ErrorGlobal />;
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
      {CardModalView === 'ftu' ? (
        <Ftu classNames={props.classNames?.Ftu} copy={props.copy?.Ftu} />
      ) : null}
      {CardModalView === 'Inbox' ? <Inbox /> : null}
    </div>
  );
};
