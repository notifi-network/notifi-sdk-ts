import clsx from 'clsx';
import React from 'react';

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
  return (
    <button
      disabled={disabled}
      className={clsx('NotifiStartChatButton__button', classNames?.button)}
      onClick={onClick}
    >
      <span className={clsx('NotifiStartChatButton__label', classNames?.label)}>
        Start Chatting
      </span>
    </button>
  );
};
