import clsx from 'clsx';
import React from 'react';

export type NotifiStartChatButtonProps = Readonly<{
  classNames?: Readonly<{
    button?: string;
    label?: string;
  }>;
  disabled: boolean;
}>;

export const NotifiStartChatButton: React.FC<NotifiStartChatButtonProps> = ({
  classNames,
  disabled,
}) => {
  return (
    <button
      disabled={disabled}
      className={clsx('NotifiStartChatButton__button', classNames?.button)}
      onClick={() => console.log('start')}
    >
      <span className={clsx('NotifiStartChatButton__label', classNames?.label)}>
        Start Chatting
      </span>
    </button>
  );
};
