import clsx from 'clsx';
import React from 'react';

import { ChatIcon } from '../../assets/ChatIcon';
import { SettingIcon } from '../../assets/SettingIcon';

export type ChatWindowHeaderProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    text: string;
  }>;
  chatWindowHeaderContent?: string;
}>;

export const ChatWindowHeader: React.FC<ChatWindowHeaderProps> = ({
  classNames,
  chatWindowHeaderContent = 'Customer Support',
}) => {
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
            classNames?.text,
          )}
        >
          {chatWindowHeaderContent}
        </div>
      </div>
      <SettingIcon />
    </div>
  );
};
