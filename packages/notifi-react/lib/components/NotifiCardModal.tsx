import clsx from 'clsx';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React, { useEffect, useState } from 'react';

import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiHistoryContext,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '../context';
import { useGlobalStateContext } from '../context/GlobalStateContext';
import { Connect, ConnectProps } from './Connect';
import { ErrorView, ErrorViewProps } from './ErrorView';
import { Expiry } from './Expiry';
import { Ftu, FtuProps } from './Ftu';
import { Inbox, InboxProps } from './Inbox';
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
    ErrorGlobal?: ErrorViewProps['copy'];
    LoadingGlobal?: LoadingGlobalProps['copy'];
    Connect?: ConnectProps['copy'];
    Ftu?: FtuProps['copy'];
    Inbox?: InboxProps['copy'];
  }>;
  classNames?: Readonly<{
    container?: string;
    Connect?: ConnectProps['classNames'];
    Ftu?: FtuProps['classNames'];
    Inbox?: InboxProps['classNames'];
  }>;
  darkMode?: boolean;
  onClose?: () => void;
}>;

export type CardModalView = 'connect' | 'expiry' | 'ftu' | 'Inbox';

export const NotifiCardModal: React.FC<NotifiCardModalProps> = (props) => {
  const { frontendClientStatus, error: clientError } =
    useNotifiFrontendClientContext();
  const {
    ftuStage,
    error: userSettingError,
    isLoading: isLoadingFtu,
  } = useNotifiUserSettingContext();
  const [CardModalView, setCardModalView] = useState<CardModalView | null>(
    null,
  );
  const { setGlobalError, globalError, setGlobalCtas } =
    useGlobalStateContext();

  const { error: historyError } = useNotifiHistoryContext();
  const { error: tenantError } = useNotifiTenantConfigContext();
  const { error: topicError } = useNotifiTopicContext();
  const { error: targetError } = useNotifiTargetContext();

  if (props.onClose) {
    setGlobalCtas({ onClose: props.onClose });
  }

  useEffect(() => {
    if (!frontendClientStatus.isInitialized) return;
    if (frontendClientStatus.isExpired) {
      setCardModalView('expiry');
      return;
    }

    if (!frontendClientStatus.isAuthenticated) {
      return setCardModalView('connect');
    }

    if (frontendClientStatus.isAuthenticated && !isLoadingFtu) {
      if (ftuStage !== FtuStage.Done) {
        setCardModalView('ftu');
        return;
      }
      setCardModalView('Inbox');
      return;
    }
    console.error('NotifiCardModal - Unexpected CardView state');
  }, [ftuStage]);

  useEffect(() => {
    if (
      userSettingError ||
      historyError ||
      tenantError ||
      topicError ||
      targetError
    ) {
      setGlobalError({
        error: new Error(
          `In 
              ${
                clientError?.message
                  ? ` FrontendClientContext: \n ${clientError.message}`
                  : ''
              } 
              ${
                userSettingError?.message
                  ? ` UserSettingContext: \n ${userSettingError.message}`
                  : ''
              }
              ${
                historyError?.message
                  ? ` HistoryContext: \n ${historyError.message}`
                  : ''
              }
              ${
                tenantError?.message
                  ? ` TenantConfigContext: \n ${tenantError.message}`
                  : ''
              }
              ${
                topicError?.message
                  ? ` TopicContext: \n ${topicError.message}`
                  : ''
              }
              ${
                targetError?.message
                  ? ` TargetContext: \n ${targetError.message}`
                  : ''
              }
          `,
        ),
      });
      return;
    }
  }, [
    userSettingError,
    isLoadingFtu,
    clientError,
    historyError,
    tenantError,
    targetError,
  ]);

  if (globalError) {
    return (
      <div
        className={clsx(
          props.darkMode ? 'notifi-theme-dark' : 'notifi-theme-light',
          'notifi-card-modal',
          props.classNames?.container,
        )}
      >
        <ErrorView
          detail={globalError.error.message}
          cta={{
            icon: 'arrow-back',
            action: () => setGlobalError(null),
          }}
        />
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
          setCardModalView={setCardModalView}
          copy={props.copy?.Connect}
          classNames={props.classNames?.Connect}
        />
      ) : null}
      {CardModalView === 'expiry' ? (
        <Expiry setCardModalView={setCardModalView} />
      ) : null}
      {CardModalView === 'ftu' ? (
        <Ftu
          classNames={props.classNames?.Ftu}
          copy={props.copy?.Ftu}
          onComplete={() => setCardModalView('Inbox')}
        />
      ) : null}
      {CardModalView === 'Inbox' ? (
        <Inbox classNames={props.classNames?.Inbox} copy={props.copy?.Inbox} />
      ) : null}
    </div>
  );
};
