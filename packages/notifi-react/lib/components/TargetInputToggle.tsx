import { DeepPartialReadonly } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React, { useMemo } from 'react';

import { Target, ToggleTarget, useNotifiTargetContext } from '../context';
import { defaultCopy } from '../utils/constants';
import { Toggle, ToggleProps } from './Toggle';

export type TargetInputToggleProps = Readonly<{
  targetType: Extract<Target, 'slack' | 'discord' | 'wallet'>;
  disabled: boolean;
  copy?: {
    title?: Partial<Record<ToggleTarget, string>>;
    unavailable?: Partial<Record<ToggleTarget, string>>;
  };
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: ToggleProps['classNames'];
    unavailable: string;
  }>;
}>;

export const TargetInputToggle: React.FC<TargetInputToggleProps> = (props) => {
  const {
    targetDocument: { targetInputs, targetData },
    updateTargetInputs,
  } = useNotifiTargetContext();

  const useTarget = useMemo(() => {
    switch (props.targetType) {
      case 'slack':
        return targetInputs.slack;
      case 'discord':
        return targetInputs.discord;
      case 'wallet':
        return targetInputs.wallet;
    }
  }, [targetInputs]);

  React.useEffect(() => {
    switch (props.targetType) {
      case 'discord':
        updateTargetInputs('discord', targetData?.discord.useDiscord);
        break;
      case 'slack':
        updateTargetInputs('slack', targetData?.slack.useSlack);
        break;
      case 'wallet':
        updateTargetInputs('wallet', targetData?.wallet.useWallet);
        break;
    }
  }, []);

  const title =
    props.targetType === 'slack'
      ? props.copy?.title?.slack ?? defaultCopy.inputToggles.slack
      : props.targetType === 'discord'
      ? props.copy?.title?.discord ?? defaultCopy.inputToggles.discord
      : props.targetType === 'wallet'
      ? props.copy?.title?.wallet ?? defaultCopy.inputToggles.wallet
      : 'Unknown target type';

  const unavailable =
    props.targetType === 'slack'
      ? props.copy?.unavailable?.slack ??
        defaultCopy.inputToggles.slackUnavailable
      : props.targetType === 'discord'
      ? props.copy?.unavailable?.discord ??
        defaultCopy.inputToggles.discordUnavailable
      : props.targetType === 'wallet'
      ? props.copy?.unavailable?.wallet ??
        defaultCopy.inputToggles.walletUnavailable
      : 'Unknown target type';

  const onClick = useMemo(() => {
    switch (props.targetType) {
      case 'slack':
        return () => updateTargetInputs('slack', !targetInputs.slack);
      case 'discord':
        return () => updateTargetInputs('discord', !targetInputs.discord);
      case 'wallet':
        return () => updateTargetInputs('wallet', !targetInputs.wallet);
    }
  }, [targetInputs]);

  const targetIsAvailable = targetData[props.targetType].isAvailable;

  return (
    <div
      data-cy={`notifi-target-input-${props.targetType}`}
      className={clsx(
        'notifi-target-input-toggle-container',
        props.classNames?.container,
      )}
    >
      <div
        className={clsx(
          'notifi-target-input-toggle-label',
          props.classNames?.label,
        )}
      >
        {title}
      </div>
      {targetIsAvailable ? (
        <Toggle
          classNames={props.classNames?.toggle}
          disabled={props.disabled}
          checked={useTarget}
          setChecked={onClick}
        />
      ) : (
        <div
          className={clsx(
            'notifi-target-input-toggle-unavailable',
            props.classNames?.unavailable,
          )}
        >
          {unavailable}
        </div>
      )}
    </div>
  );
};
