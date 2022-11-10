import clsx from 'clsx';
import React from 'react';

import { ChatMessageDate, ChatMessageDateProps } from './ChatMessageData';
import { MessageList, MessageListProps } from './MessageList';

export type ChatMessageSectionProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    content: string;
    date: ChatMessageDateProps['classNames'];
    messageList: MessageListProps['classNames'];
  }>;
  chatMessageSectionIntroContent?: string;
}>;

export const ChatMessageSection: React.FC<ChatMessageSectionProps> = ({
  classNames,
  chatMessageSectionIntroContent = 'What can we help you with today?',
}) => {
  return (
    <div
      className={clsx(
        'NotifiIntercomChatMessageSection__container',
        classNames?.container,
      )}
    >
      <ChatMessageDate classNames={classNames?.date} />
      <div
        className={clsx(
          'NotifiIntercomChatMessageSectionIntro__content',
          classNames?.content,
        )}
      >
        {chatMessageSectionIntroContent}
      </div>
      <MessageList classNames={classNames?.messageList} />
    </div>
  );
};
