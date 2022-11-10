import clsx from 'clsx';
import React from 'react';

type Message = {
  body: string;
  timeStamp: string;
  sender: string;
  avatar: string;
};

export type MessageGroupProps = Readonly<{
  classNames?: Readonly<{
    messageGroupContainer: string;
    messageContainer: string;
    messageBody: string;
    timeStamp: string;
    sender: string;
  }>;
  messages: Message[];
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
      {messages.map((message, index) => (
        <div
          className={clsx(
            isIncoming
              ? 'NotifiIntercomChatIncomingMessage__container'
              : 'NotifiIntercomChatOutgoingMessage__container',
            classNames?.messageContainer,
          )}
        >
          {isIncoming ? (
            <div>
              <img height={34} src={message.avatar} />
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
                {message.sender}
              </div>
            ) : null}
            <div key={index}>{message.body}</div>
            <div
              className={clsx(
                'NotifiIntercomChatOutgoingMessage__timeStamp',
                classNames?.timeStamp,
              )}
            >
              {message.timeStamp}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
