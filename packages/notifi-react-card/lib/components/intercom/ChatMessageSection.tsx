import React from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useNotifiSubscriptionContext } from '../../context';
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
  chatIntroQuestion: string;
}>;

export const ChatMessageSection: React.FC<ChatMessageSectionProps> = ({
  classNames,
  chatIntroQuestion,
}) => {
  const { conversationId, userId } = useNotifiSubscriptionContext();
  const {
    conversation,
    setIsScrolling,
    setVisibleRange,
    setAtTop,
    isLoading,
    hasNextPage,
    sendConversationMessages,
  } = useIntercomChat({
    conversationId,
    userId,
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
                {index != 0 && !feed.isSameDate && (
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
            flexGrow: 1,
            scrollbarGutter: 'stable',
            overflowY: 'scroll',
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
