import clsx from 'clsx';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import React from 'react';

import { ChatMessage } from '../../hooks/useIntercomChat';
import { formatHourTimestamp } from '../../utils/datetimeUtils';

export type MessageGroupProps = Readonly<{
  classNames?: Readonly<{
    messageGroupContainer: string;
    messageContainer: string;
    messageBody: string;
    timeStamp: string;
    sender: string;
    avatar: string;
  }>;
  messages: ChatMessage[];
  direction: string;
}>;

export const MessageGroup: React.FC<MessageGroupProps> = ({
  classNames,
  messages,
  direction,
}) => {
  const { supportAvatarUrl } = useNotifiSubscriptionContext();
  const isIncoming = direction === 'INCOMING';
  return (
    <div
      className={clsx(
        isIncoming
          ? 'NotifiIntercomChatIncomingMessageGroup__container'
          : 'NotifiIntercomChatOutgoingMessageGroup__container',
        classNames?.messageGroupContainer,
      )}
    >
      {messages.map((message, index) => (
        <div
          className={clsx(
            isIncoming
              ? 'NotifiIntercomChatIncomingMessage__container'
              : 'NotifiIntercomChatOutgoingMessage__container',
            classNames?.messageContainer,
          )}
          key={index}
        >
          {isIncoming ? (
            <div>
              <img
                height={34}
                src={supportAvatarUrl}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
                className={clsx(
                  'NotifiIntercomChatMessage__avatar',
                  classNames?.avatar,
                )}
              />
            </div>
          ) : null}
          <div
            key={index}
            className={clsx(
              isIncoming
                ? 'NotifiIntercomChatIncomingMessage__body'
                : 'NotifiIntercomChatOutgoingMessage__body',
              classNames?.messageBody,
            )}
          >
            {isIncoming ? (
              <div
                className={clsx(
                  'NotifiIntercomChatOutgoingMessage__sender',
                  classNames?.sender,
                )}
              >
                {message.conversationParticipant.resolvedName}
              </div>
            ) : null}
            <div key={index}>{message.message}</div>
            <div
              className={clsx(
                'NotifiIntercomChatOutgoingMessage__timeStamp',
                classNames?.timeStamp,
              )}
            >
              {formatHourTimestamp(message.createdDate)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
