import clsx from 'clsx';
import React from 'react';

export type NotifiStartChatButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
  disabled: boolean;
  onClick: () => void;
  hasChatAlert: boolean;
}>;

export const NotifiStartChatButton: React.FC<NotifiStartChatButtonProps> = ({
  classNames,
  disabled,
  onClick,
  hasChatAlert,
}) => {
  return (
    <button
      disabled={disabled}
      className={clsx('NotifiStartChatButton__button', classNames?.button)}
      onClick={onClick}
    >
      <span className={clsx('NotifiStartChatButton__label', classNames?.label)}>
        {hasChatAlert ? 'Save Changes' : 'Start Chatting'}
      </span>
    </button>
  );
};
