import clsx from 'clsx';
import React from 'react';

import { ChatMessageDate, ChatMessageDateProps } from './ChatMessageDate';

export type ChatWindowIntroSectionProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    content: string;
    date: ChatMessageDateProps['classNames'];
  }>;
  chatMessageSectionIntroContent?: string;
  startDate: string;
  inVirtualContainerStyle?: string;
}>;

export const ChatWindowIntroSection: React.FC<
  React.PropsWithChildren<ChatWindowIntroSectionProps>
> = ({
  classNames,
  startDate,
  chatMessageSectionIntroContent = 'What can we help you with today?',
  children,
  inVirtualContainerStyle,
}) => {
  return (
    <div
      className={clsx(
        'NotifiIntercomChatMessageSection__container',
        inVirtualContainerStyle,
        classNames?.container,
      )}
    >
      <ChatMessageDate classNames={classNames?.date} createdDate={startDate} />
      <div
        className={clsx(
          'NotifiIntercomChatMessageSectionIntro__content',
          classNames?.content,
        )}
      >
        {chatMessageSectionIntroContent}
      </div>
      {children}
    </div>
  );
};
