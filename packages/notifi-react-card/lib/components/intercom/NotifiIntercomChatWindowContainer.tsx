import React from 'react';

import {
  ChatMessageSection,
  ChatMessageSectionProps,
} from './ChatMessageSection';
import { ChatWindowHeader, ChatWindowHeaderProps } from './ChatWindowHeader';
import {
  SendMessageSection,
  SendMessageSectionProps,
} from './SendMessageSection';

export type NotifiIntercomChatWindowContainerProps = Readonly<{
  classNames?: Readonly<{
    header?: ChatWindowHeaderProps['classNames'];
    chatMessageSection?: ChatMessageSectionProps['classNames'];
    sendMessageSection?: SendMessageSectionProps['classNames'];
  }>;
}>;

export const NotifiIntercomChatWindowContainer: React.FC<
  React.PropsWithChildren<NotifiIntercomChatWindowContainerProps>
> = ({
  classNames,
}: React.PropsWithChildren<NotifiIntercomChatWindowContainerProps>) => {
  return (
    <>
      <ChatWindowHeader classNames={classNames?.header} />
      <ChatMessageSection classNames={classNames?.chatMessageSection} />
      <SendMessageSection classNames={classNames?.sendMessageSection} />
    </>
  );
};
