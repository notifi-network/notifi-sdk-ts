import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import React from 'react';

import { ChatIcon } from '../../assets/ChatIcon';
import { SettingIcon } from '../../assets/SettingIcon';

export type ChatWindowHeaderProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    content: string;
  }>;
  chatWindowHeaderContent: string;
}>;

export const ChatWindowHeader: React.FC<ChatWindowHeaderProps> = ({
  classNames,
  chatWindowHeaderContent,
}) => {
  const { setIntercomCardView } = useNotifiSubscriptionContext();
  const handleClick = () => {
    setIntercomCardView({ state: 'settingView' });
  };
  return (
    <div
      className={clsx(
        'NotifiIntercomChatWindowHeader__container',
        classNames?.container,
      )}
    >
      <div className={'NotifiIntercomChatWindowHeader__leftContainer'}>
        <ChatIcon />
        <div
          className={clsx(
            'NotifiIntercomChatWindowHeader__content',
            classNames?.content,
          )}
        >
          {chatWindowHeaderContent}
        </div>
      </div>
      <div
        onClick={handleClick}
        className={'NotifiIntercomChatWindow__settingIcon'}
      >
        <SettingIcon />
      </div>
    </div>
  );
};
