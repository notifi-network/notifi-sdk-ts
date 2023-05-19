import clsx from 'clsx';
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
  }>;
  messages: ChatMessage[];
  direction: string;
}>;
export const MessageGroup: React.FC<MessageGroupProps> = ({
  classNames,
  messages,
  direction,
}) => {
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
      {messages.map((message, index) => {
        return (
          <div
            className={clsx(
              isIncoming
                ? 'NotifiIntercomChatIncomingMessage__container'
                : 'NotifiIntercomChatOutgoingMessage__container',
              classNames?.messageContainer,
            )}
            key={index}
          >
            <div
              key={index}
              className={clsx(
                isIncoming
                  ? 'NotifiIntercomChatIncomingMessage__body'
                  : 'NotifiIntercomChatOutgoingMessage__body',
                classNames?.messageBody,
              )}
            >
              {isIncoming && index === 0 ? (
                <div
                  className={clsx(
                    'NotifiIntercomChatOutgoingMessage__sender',
                    classNames?.sender,
                  )}
                >
                  {message.conversationParticipant?.resolvedName}
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
        );
      })}
    </div>
  );
};
