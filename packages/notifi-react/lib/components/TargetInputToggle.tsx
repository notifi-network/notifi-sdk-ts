import clsx from 'clsx';
import { DeepPartialReadonly } from 'notifi-react-card/lib/utils';
import React, { useMemo } from 'react';

import { Target, useNotifiTargetContext } from '../context';
import { defaultCopy } from '../utils/constants';
import { Toggle, ToggleProps } from './Toggle';

export type TargetInputToggleProps = Readonly<{
  targetType: Extract<Target, 'slack' | 'discord'>;
  disabled: boolean;
  copy?: {
    title?: string;
  };
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: ToggleProps['classNames'];
  }>;
}>;

export const TargetInputToggle: React.FC<TargetInputToggleProps> = (props) => {
  const {
    targetDocument: { targetInputs },
    updateTargetInputs,
  } = useNotifiTargetContext();

  const useTarget = useMemo(() => {
    switch (props.targetType) {
      case 'slack':
        return targetInputs.slack;
      case 'discord':
        return targetInputs.discord;
    }
  }, [targetInputs]);

  const title =
    props.copy?.title ?? props.targetType === 'slack'
      ? defaultCopy.inputToggles.slack
      : defaultCopy.inputToggles.discord;

  const onClick = useMemo(() => {
    switch (props.targetType) {
      case 'slack':
        return () => updateTargetInputs('slack', !targetInputs.slack);
      case 'discord':
        return () => updateTargetInputs('discord', !targetInputs.discord);
    }
  }, [targetInputs]);

  return (
    <div
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
      <Toggle
        classNames={props.classNames?.toggle}
        disabled={props.disabled}
        checked={useTarget}
        setChecked={onClick}
      />
    </div>
  );
};
