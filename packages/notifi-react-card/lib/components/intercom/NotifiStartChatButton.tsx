import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
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
