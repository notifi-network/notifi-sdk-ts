import React from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useIntercomChat } from '../../hooks/useIntercomChat';
import { ChatMessageDate, ChatMessageDateProps } from './ChatMessageDate';
import {
  ChatWindowIntroSection,
  ChatWindowIntroSectionProps,
} from './ChatWindowIntroSection';
import { MessageList, MessageListProps } from './MessageList';
import {
  SendMessageSection,
  SendMessageSectionProps,
} from './SendMessageSection';

export type ChatMessageSectionProps = Readonly<{
  classNames?: Readonly<{
    chatWindowIntro: ChatWindowIntroSectionProps['classNames'];
    messageList: MessageListProps['classNames'];
    date: ChatMessageDateProps['classNames'];
    sendMessageSection: SendMessageSectionProps['classNames'];
  }>;
  messageListWidth?: string;
  messageListHeight?: string;
  chatIntroQuestion: string;
}>;

export const ChatMessageSection: React.FC<ChatMessageSectionProps> = ({
  classNames,
  messageListWidth,
  messageListHeight,
  chatIntroQuestion,
}) => {
  const {
    conversation,
    setIsScrolling,
    setVisibleRange,
    setAtTop,
    isLoading,
    hasNextPage,
    sendConversationMessages,
  } = useIntercomChat({
    conversationId: 'f03c78b1ffee4d7eb2ff030f6e665cba',
  });

  return (
    <>
      {conversation.feed.length === 0 ? (
        <ChatWindowIntroSection
          chatIntroQuestion={chatIntroQuestion}
          classNames={classNames?.chatWindowIntro}
          startDate={conversation.createdDate}
        />
      ) : (
        <Virtuoso
          //TODO: improvement to add the scrollSeekConfiguration property
          atTopStateChange={setAtTop}
          className="virtual-container"
          data={conversation.feed}
          followOutput="auto"
          isScrolling={setIsScrolling}
          rangeChanged={setVisibleRange}
          itemContent={(index, feed) => {
            const isFirstIndexOnLastPage = index === 0 && !hasNextPage;
            return (
              <div key={index}>
                {isLoading ? (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: '10px',
                    }}
                  >
                    Loading...
                  </div>
                ) : null}
                {isFirstIndexOnLastPage && (
                  <ChatWindowIntroSection
                    classNames={classNames?.chatWindowIntro}
                    startDate={conversation.createdDate}
                    chatIntroQuestion={chatIntroQuestion}
                    inVirtualContainerStyle={
                      'ChatWindowIntro__virtualContainer'
                    }
                  />
                )}
                {index != 0 && (
                  <ChatMessageDate
                    classNames={classNames?.date}
                    createdDate={feed.timestamp}
                    isStartDate={false}
                  />
                )}
                <MessageList classNames={classNames?.messageList} feed={feed} />
              </div>
            );
          }}
          style={{
            width: messageListWidth || '364px',
            height: messageListHeight || '290px',
          }}
        />
      )}
      <SendMessageSection
        classNames={classNames?.sendMessageSection}
        sendConversationMessages={sendConversationMessages}
      />
    </>
  );
};
