import { ConversationMessagesEntry } from '@notifi-network/notifi-core/dist/models/ConversationMessages';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListRange } from 'react-virtuoso';

import { useNotifiClientContext } from '../context';
import { formatConversationDateTimestamp } from '../utils/datetimeUtils';

export type ChatMessage = Readonly<{
  id: string;
  message: string;
  userId: string;
  createdDate: string;
  updatedDate: string;
  conversationId: string;
}>;

type MessageDirection = 'INCOMING' | 'OUTGOING';

type MessagesBlockFeedEntry = Readonly<{
  type: 'MESSAGES_BLOCK';
  direction: MessageDirection;
  messages: ChatMessage[];
}>;

export type FeedEntry = {
  id: string;
  timestamp: string;
} & MessagesBlockFeedEntry;

type GetConversationMessagesInputProps = Readonly<{
  first?: number;
  conversationId: string;
}>;

export const useIntercomChat = ({
  first = 5,
  conversationId,
}: GetConversationMessagesInputProps) => {
  const [chatMessages, setChatMessages] = useState<ConversationMessagesEntry[]>(
    [],
  );
  const [endCursor, setEndCursor] = useState<string | undefined>();
  const [hasNextPage, setHasNextPage] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [atTop, setAtTop] = useState<boolean>(false);
  const [visibleRange, setVisibleRange] = useState<ListRange>({
    startIndex: 0,
    endIndex: 0,
  });
  const [isScrolling, setIsScrolling] = useState<boolean | null>();
  const { client } = useNotifiClientContext();

  const getConversationMessages = useCallback(() => {
    setIsLoading(true);
    client
      .getConversationMessages({
        first,
        after: endCursor,
        getConversationMessagesInput: { conversationId },
      })
      .then((response) => {
        if (Array.isArray(response.nodes)) {
          setChatMessages([...chatMessages, ...response.nodes]);
        }
        if (response.pageInfo) {
          setEndCursor(response.pageInfo.endCursor);
          setHasNextPage(response.pageInfo.hasNextPage);
        }
        setIsLoading(false);
      });
  }, [conversationId, endCursor, chatMessages]);

  // initialization - load first batch of messages
  useEffect(() => {
    getConversationMessages();
  }, []);

  // load more messages when scrolling to the top
  useEffect(() => {
    if (hasNextPage && atTop && isScrolling && visibleRange.startIndex === 0) {
      getConversationMessages();
    }
  }, [hasNextPage, atTop, isScrolling, visibleRange.startIndex]);

  const conversation = useMemo(() => {
    const getFeed = () => {
      const messageGroups: ChatMessage[][] = [];

      let messages: ChatMessage[] = [];

      chatMessages?.forEach((message, index) => {
        const nextMessage = chatMessages[index + 1];

        /// timestamp logic
        messages.unshift(message);
        if (
          message?.userId !== nextMessage?.userId ||
          formatConversationDateTimestamp(message?.createdDate) !=
            formatConversationDateTimestamp(nextMessage?.createdDate)
        ) {
          messageGroups.unshift(messages);
          messages = [];
        }
      });

      const feedEntries = messageGroups.map((messageGroup): FeedEntry => {
        const firstMessage = messageGroup[0];

        return {
          direction:
            firstMessage?.userId === 'c85e8969-10df-43c6-aa4d-402c068e0159'
              ? 'OUTGOING'
              : 'INCOMING',
          id: firstMessage?.id,
          messages: [...messageGroup],
          timestamp: firstMessage?.createdDate,
          type: 'MESSAGES_BLOCK',
        };
      });

      return feedEntries;
    };
    return {
      feed: getFeed(),
      createdDate:
        chatMessages?.[chatMessages.length - 1]?.createdDate ??
        new Date().toISOString(),
      lastMessage: chatMessages?.[0],
    };
  }, [chatMessages, conversationId]);

  return {
    conversation,
    getConversationMessages,
    setIsScrolling,
    setVisibleRange,
    setAtTop,
    hasNextPage,
    isLoading,
  };
};
