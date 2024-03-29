import React from 'react';

import {
  ChatMessageSection,
  ChatMessageSectionProps,
} from './ChatMessageSection';
import { ChatWindowHeader, ChatWindowHeaderProps } from './ChatWindowHeader';
import { SendMessageSectionProps } from './SendMessageSection';

export type NotifiIntercomChatWindowContainerProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    header?: ChatWindowHeaderProps['classNames'];
    chatMessageSection?: ChatMessageSectionProps['classNames'];
    sendMessageSection?: SendMessageSectionProps['classNames'];
  }>;
  chatIntroQuestion: string;
  chatWindowHeaderContent: string;
}>;

export const NotifiIntercomChatWindowContainer: React.FC<
  React.PropsWithChildren<NotifiIntercomChatWindowContainerProps>
> = ({
  classNames,
  chatWindowHeaderContent,
  chatIntroQuestion,
}: React.PropsWithChildren<NotifiIntercomChatWindowContainerProps>) => {
  return (
    <>
      <ChatWindowHeader
        classNames={classNames?.header}
        chatWindowHeaderContent={chatWindowHeaderContent}
      />
      <ChatMessageSection
        classNames={classNames?.chatMessageSection}
        chatIntroQuestion={chatIntroQuestion}
      />
    </>
  );
};
