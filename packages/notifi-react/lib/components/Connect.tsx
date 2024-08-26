import clsx from 'clsx';
import React from 'react';

import { Icon, IconType } from '../assets/Icons';
import {
  useNotifiFrontendClientContext,
  useNotifiTenantConfigContext,
} from '../context';
import { useGlobalStateContext } from '../context/GlobalStateContext';
import { useConnect } from '../hooks/useConnect';
import { defaultCopy } from '../utils/constants';
import { LoadingAnimation } from './LoadingAnimation';
import { CardModalView } from './NotifiCardModal';
import { PoweredByNotifi, PoweredByNotifiProps } from './PoweredByNotifi';
import { Toggle } from './Toggle';

export type ConnectProps = {
  iconType?: IconType;
  setCardModalView: React.Dispatch<React.SetStateAction<CardModalView | null>>;
  loginWithoutSubscription?: boolean;
  copy?: {
    title?: string;
    hardwareWalletLabel?: string;
    buttonText?: string;
    description?: string;
  };
  classNames?: {
    container?: string;
    main?: string;
    icon?: string;
    button?: string;
    footer?: string;
    PoweredByNotifi?: PoweredByNotifiProps['classNames'];
    loadingSpinner?: React.CSSProperties;
    title?: string;
    description?: string;
    alertsContainer?: string;
    alert?: string;
    hardwareWallet?: string;
    hardwareWalletLabel?: string;
    buttonText?: string;
  };
};

export const Connect: React.FC<ConnectProps> = (props) => {
  const { walletWithSignParams } = useNotifiFrontendClientContext();
  const { fusionEventTopics } = useNotifiTenantConfigContext();
  const { globalCtas } = useGlobalStateContext();

  const {
    connect,
    isLoading,
    useHardwareWalletLogin,
    setUseHardwareWalletLogin,
  } = useConnect(
    (cardModalView) => props.setCardModalView(cardModalView),
    props.loginWithoutSubscription,
  );

  const topicLists = React.useMemo(() => {
    // TODO: Move to NotifiTenantConfigContext when somewhere else needs this
    const topicGroupNames: { index: number; value: string }[] = [];
    const topicNames: { index: number; value: string }[] = [];
    fusionEventTopics.forEach((topic, id) => {
      if (topic.uiConfig.topicGroupName) {
        if (
          topicGroupNames
            .map((name) => name.value)
            .includes(topic.uiConfig.topicGroupName)
        )
          return;
        topicGroupNames.push({
          index: topic.uiConfig.index ?? id,
          value: topic.uiConfig.topicGroupName,
        });
        return;
      }
      topicNames.push({
        index: topic.uiConfig.index ?? id,
        value: topic.uiConfig.name,
      });
    });
    return [...topicNames, ...topicGroupNames].sort(
      (a, b) => a.index - b.index,
    );
  }, [fusionEventTopics]);

  return (
    <div className={clsx('notifi-connect', props.classNames?.container)}>
      <div className={clsx('notifi-connect-title', props.classNames?.title)}>
        {props.copy?.title ?? defaultCopy.connect.title}

        {globalCtas?.onClose ? (
          <div
            className="notifi-connect-right-cta"
            onClick={() => globalCtas?.onClose?.()}
          >
            <Icon type={'close'} />
          </div>
        ) : null}
      </div>
      <div
        className={clsx(
          'notifi-connect-description',
          props.classNames?.description,
        )}
      >
        {props.copy?.description ?? defaultCopy.connect.description}
      </div>
      <div className={clsx('notifi-connect-main', props.classNames?.main)}>
        <div
          data-cy="notifi-connect-alert-list-container"
          className={clsx(
            'notifi-connect-alert-list-container',
            props.classNames?.alertsContainer,
          )}
        >
          {topicLists.map((topic) => {
            return (
              <div
                className={clsx(
                  'notifi-connect-alert-list-alert',
                  props.classNames?.alert,
                )}
                key={topic.value}
              >
                <Icon
                  type={props.iconType ?? 'check'}
                  className={clsx(
                    'notifi-connect-alert-icon',
                    props.classNames?.icon,
                  )}
                />
                {topic.value}
              </div>
            );
          })}
        </div>
      </div>
      {walletWithSignParams.walletBlockchain === 'SOLANA' ? (
        /* NOTE: Only Solana requires special handling for hardware wallet login (see detail in NotifiFrontendClientContext.tsx) */
        // TODO: Crete a separate component SolanaHardwareWalletToggle.tsx
        <div
          className={clsx(
            'notifi-connect-hardware-wallet',
            props.classNames?.hardwareWallet,
          )}
        >
          <div
            className={clsx(
              'notifi-connect-hardware-wallet-label',
              props.classNames?.hardwareWalletLabel,
            )}
          >
            {props.copy?.hardwareWalletLabel ??
              defaultCopy.connect.hardwareWalletLabel}
          </div>
          <Toggle
            setChecked={() => setUseHardwareWalletLogin((prev) => !prev)}
            checked={useHardwareWalletLogin}
            disabled={isLoading}
          />
        </div>
      ) : null}
      <button
        data-cy="notifi-connect-button"
        className={clsx('notifi-connect-button', props.classNames?.button)}
        disabled={isLoading}
        onClick={connect}
      >
        {isLoading ? (
          <LoadingAnimation
            type="spinner"
            classNames={{ spinner: 'notifi-connect-button-spinner' }}
          />
        ) : null}
        <div
          className={clsx('notifi-connect-button-text', isLoading && 'hidden')}
        >
          {props.copy?.buttonText
            ? props.copy.buttonText
            : defaultCopy.connect.buttonText}
        </div>
      </button>

      <div className={clsx('notifi-connect-footer', props.classNames?.footer)}>
        <PoweredByNotifi classNames={props.classNames?.PoweredByNotifi} />
      </div>
    </div>
  );
};
