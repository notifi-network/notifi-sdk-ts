import clsx from 'clsx';
import React from 'react';
import { Virtuoso } from 'react-virtuoso';

import { MessageGroup, MessageGroupProps } from './MessageGroup';

const mockConversation = [
  {
    direction: 'INCOMING',
    messages: [
      {
        body: 'Good morning! What can we help you with today?',
        timeStamp: '11:19 AM',
        sender: 'Gwen',
        avatar: 'https://i.postimg.cc/K8c0KDpZ/img-alert-transaction.png',
      },
    ],
  },
  {
    direction: 'OUTGOING',
    messages: [
      {
        body: 'I’m having an issue',
        timeStamp: '11:20 AM',
        sender: '',
        avatar: '',
      },
      {
        body: 'Where when I connect a wallet',
        timeStamp: '11:21 AM',
        sender: '',
        avatar: '',
      },
      {
        body: 'I’m having an issue',
        timeStamp: '11:20 AM',
        sender: '',
        avatar: '',
      },
      {
        body: 'Where when I connect a wallet',
        timeStamp: '11:21 AM',
        sender: '',
        avatar: '',
      },
    ],
  },
];

export type MessageListProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    messageGroup: MessageGroupProps['classNames'];
  }>;
}>;

export const MessageList: React.FC<MessageListProps> = ({ classNames }) => {
  return (
    <div
      className={clsx(
        'NotifiIntercomChatMessageList__container',
        classNames?.container,
      )}
    >
      <Virtuoso
        className="virtual-container"
        data={mockConversation}
        followOutput="auto"
        itemContent={(index, feed) => {
          return (
            <MessageGroup
              classNames={classNames?.messageGroup}
              messages={feed.messages}
              direction={feed.direction}
              key={index}
            />
          );
        }}
        style={{ height: '290px', width: '364px' }}
      />
    </div>
  );
};
