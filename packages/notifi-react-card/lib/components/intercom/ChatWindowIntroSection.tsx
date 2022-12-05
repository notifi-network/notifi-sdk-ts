import clsx from 'clsx';
import React from 'react';

import { ChatMessageDate, ChatMessageDateProps } from './ChatMessageDate';

export type ChatWindowIntroSectionProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    content: string;
    date: ChatMessageDateProps['classNames'];
  }>;
  startDate: string;
  inVirtualContainerStyle?: string;
  chatIntroQuestion: string;
}>;

export const ChatWindowIntroSection: React.FC<
  React.PropsWithChildren<ChatWindowIntroSectionProps>
> = ({
  classNames,
  startDate,
  children,
  inVirtualContainerStyle,
  chatIntroQuestion,
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
        {chatIntroQuestion}
      </div>
      {children}
    </div>
  );
};
