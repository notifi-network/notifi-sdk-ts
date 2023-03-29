import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../context';
import { DeepPartialReadonly } from '../utils';
import { NotifiToggle, NotifiToggleProps } from './subscription';

export type NotifiDiscordToggleProps = Readonly<{
  disabled: boolean;
  classNames?: DeepPartialReadonly<{
    container: string;
    label: string;
    toggle: NotifiToggleProps['classNames'];
  }>;
}>;

export const NotifiDiscordToggle: React.FC<NotifiDiscordToggleProps> = ({
  classNames,
  disabled,
}) => {
  const { useDiscord, setUseDiscord } = useNotifiSubscriptionContext();

  return (
    <div
      className={clsx('NotifiDiscordToggle__container', classNames?.container)}
    >
      <div className={clsx('NotifiDiscordToggle__label', classNames?.label)}>
        Discord
      </div>
      <NotifiToggle
        classNames={classNames?.toggle}
        disabled={disabled}
        checked={useDiscord}
        setChecked={setUseDiscord}
      />
    </div>
  );
};
