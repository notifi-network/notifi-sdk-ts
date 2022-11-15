import { useCallback } from 'react';

import { useNotifiClientContext } from '../context';

type GetConversationMessagesInputProps = Readonly<{
  first?: number;
  after?: string;
  conversationId: string;
}>;

export const useConversationMessages = ({
  first,
  after,
  conversationId,
}: GetConversationMessagesInputProps) => {
  const { client } = useNotifiClientContext();

  const input = {
    first: first,
    after: after,
    getConversationMessagesInput: { conversationId },
  };

  const getConversationMessages = useCallback(async () => {
    const response = await client.getConversationMessages(input);
    return response;
  }, []);

  return {
    getConversationMessages,
  };
};
