import clsx from 'clsx';
import React from 'react';

import { useNotifiSubscriptionContext } from '../../context';

export type NotifiStartChatButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
  disabled: boolean;
  onClick: () => void;
}>;

export const NotifiStartChatButton: React.FC<NotifiStartChatButtonProps> = ({
  classNames,
  disabled,
  onClick,
}) => {
  const { intercomCardView } = useNotifiSubscriptionContext();
  return (
    <button
      disabled={disabled}
      className={clsx('NotifiStartChatButton__button', classNames?.button)}
      onClick={onClick}
    >
      <span className={clsx('NotifiStartChatButton__label', classNames?.label)}>
        {intercomCardView.state === 'settingView'
          ? 'Save Changes'
          : 'Start Chatting'}
      </span>
    </button>
  );
};
