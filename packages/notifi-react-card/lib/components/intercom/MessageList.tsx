import clsx from 'clsx';
import React from 'react';

import { FeedEntry } from '../../hooks/useIntercomChat';
import { MessageGroup, MessageGroupProps } from './MessageGroup';

export type MessageListProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    messageGroup: MessageGroupProps['classNames'];
  }>;
  feed: FeedEntry;
}>;

export const MessageList: React.FC<MessageListProps> = ({
  classNames,
  feed,
}) => {
  return (
    <div
      className={clsx(
        'NotifiIntercomChatMessageList__container',
        classNames?.container,
      )}
    >
      <MessageGroup
        classNames={classNames?.messageGroup}
        messages={feed.messages}
        direction={feed.direction}
      />
    </div>
  );
};
