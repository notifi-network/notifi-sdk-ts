import React from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useIntercomChat } from '../../hooks/useIntercomChat';
import { ChatMessageDate, ChatMessageDateProps } from './ChatMessageDate';
import {
  ChatWindowIntroSection,
  ChatWindowIntroSectionProps,
} from './ChatWindowIntroSection';
import { MessageList, MessageListProps } from './MessageList';

export type ChatMessageSectionProps = Readonly<{
  classNames?: Readonly<{
    chatWindowIntro: ChatWindowIntroSectionProps['classNames'];
    messageList: MessageListProps['classNames'];
    date: ChatMessageDateProps['classNames'];
  }>;
  chatMessageSectionIntroContent?: string;
  messageListWidth?: string;
  messageListHeight?: string;
}>;

export const ChatMessageSection: React.FC<ChatMessageSectionProps> = ({
  classNames,
  chatMessageSectionIntroContent,
  messageListWidth,
  messageListHeight,
}) => {
  const {
    conversation,
    setIsScrolling,
    setVisibleRange,
    setAtTop,
    isLoading,
    hasNextPage,
  } = useIntercomChat({
    conversationId: '8c5ccf41d93c4bb9b5e1e1014002e923',
  });

  return (
    <>
      {conversation.feed.length === 0 ? (
        <ChatWindowIntroSection
          classNames={classNames?.chatWindowIntro}
          startDate={conversation.createdDate}
          chatMessageSectionIntroContent={chatMessageSectionIntroContent}
        />
      ) : (
        <Virtuoso
          //TODO: improvement to add the scrollSeekConfiguration property
          //to render a placeholder element instead of the actual item if the user scrolls too fast
          atTopStateChange={setAtTop}
          className="virtual-container"
          data={conversation.feed}
          followOutput="auto"
          isScrolling={setIsScrolling}
          rangeChanged={setVisibleRange}
          itemContent={(index, feed) => {
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
                {index === 0 && !hasNextPage && (
                  <ChatWindowIntroSection
                    classNames={classNames?.chatWindowIntro}
                    startDate={conversation.createdDate}
                    chatMessageSectionIntroContent={
                      chatMessageSectionIntroContent
                    }
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
    </>
  );
};
