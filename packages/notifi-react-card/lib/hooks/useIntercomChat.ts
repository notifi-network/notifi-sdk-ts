import { ConversationMessagesEntry } from '@notifi-network/notifi-core/dist/models/ConversationMessages';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListRange } from 'react-virtuoso';

import { useNotifiClientContext } from '../context';
import {
  formatConversationDateTimestamp,
  sortByDate,
} from '../utils/datetimeUtils';

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

type UseIntercomChatProps = Readonly<{
  userId?: string;
  conversationId: string;
}>;

const MESSAGES_NUMBER = 5;

export const useIntercomChat = ({
  conversationId,
  userId = '0ff9528b-9bd4-444f-adcb-482673b31c96',
}: UseIntercomChatProps) => {
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

  useEffect(() => {
    const intervalId = setInterval(function () {
      client
        .getConversationMessages({
          first: 50,
          getConversationMessagesInput: { conversationId },
        })
        .then((response) => {
          if (Array.isArray(response.nodes)) {
            const nodes = response.nodes;
            if (nodes[0].id === chatMessages[0].id) {
              return;
            } else {
              const chatMessageIds = chatMessages.map((message) => message.id);
              const dedupeNewMessages = nodes.filter(
                (node) => !chatMessageIds.includes(node.id),
              );
              const dedupeMessages = [...dedupeNewMessages, ...chatMessages];
              const sortedMessages = dedupeMessages.sort(
                sortByDate((message) => new Date(message.createdDate), 'DESC'),
              );
              setChatMessages([...sortedMessages]);
            }
          }
        });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [chatMessages]);

  const getConversationMessages = useCallback(
    (first = MESSAGES_NUMBER) => {
      setIsLoading(true);
      if (conversationId) {
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
      }
    },
    [conversationId, endCursor, chatMessages],
  );

  // initialization - load first batch of messages
  useEffect(() => {
    getConversationMessages();
  }, []);

  // load more messages when scrolling to the top
  useEffect(() => {
    if (hasNextPage && atTop && isScrolling && visibleRange.startIndex === 0) {
      getConversationMessages();
    }
  }, [
    getConversationMessages,
    hasNextPage,
    atTop,
    isScrolling,
    visibleRange.startIndex,
  ]);

  const conversation = useMemo(() => {
    //put the conversation into message group
    const messageGroups: ChatMessage[][] = [];

    let messages: ChatMessage[] = [];

    chatMessages?.forEach((message, index) => {
      const nextMessage = chatMessages[index + 1];
      const isSameUserId = message?.userId === nextMessage?.userId;
      const isSameDate =
        formatConversationDateTimestamp(message?.createdDate) ===
        formatConversationDateTimestamp(nextMessage?.createdDate);
      messages.unshift(message);
      if (!isSameUserId || !isSameDate) {
        messageGroups.unshift(messages);
        messages = [];
      }
    });

    const feed = messageGroups.map((messageGroup): FeedEntry => {
      const firstMessage = messageGroup[0];

      return {
        direction: firstMessage?.userId === userId ? 'OUTGOING' : 'INCOMING',
        id: firstMessage?.id,
        messages: messageGroup,
        timestamp: firstMessage?.createdDate,
        type: 'MESSAGES_BLOCK',
      };
    });

    return {
      feed,
      createdDate:
        chatMessages?.[chatMessages.length - 1]?.createdDate ??
        new Date().toISOString(),
      lastMessage: chatMessages?.[0],
    };
  }, [chatMessages, conversationId]);

  const sendConversationMessages = useCallback(
    (message: string) => {
      if (message === '') {
        return;
      } else {
        client
          .sendConversationMessages({
            sendConversationMessageInput: {
              conversationId,
              message,
            },
          })
          .then((response) => {
            setChatMessages([response, ...chatMessages]);
          });
      }
    },
    [conversationId, chatMessages],
  );

  return {
    conversation,
    getConversationMessages,
    setIsScrolling,
    setVisibleRange,
    setAtTop,
    hasNextPage,
    isLoading,
    sendConversationMessages,
  };
};
