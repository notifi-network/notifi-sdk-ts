import clsx from 'clsx';
import React from 'react';

import { FeedEntry } from '../../hooks/useIntercomChat';
import { MessageGroup, MessageGroupProps } from './MessageGroup';

export type MessageListProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    messageGroup: MessageGroupProps['classNames'];
    avatar: string;
  }>;
  feed: FeedEntry;
}>;

export const MessageList: React.FC<MessageListProps> = ({
  classNames,
  feed,
}) => {
  const isIncoming = feed.direction === 'INCOMING';
  const participantProfile = feed.messages[0].conversationParticipant?.profile;
  return (
    <div
      className={clsx(
        'NotifiIntercomChatMessageList__container',
        classNames?.container,
      )}
    >
      {isIncoming ? (
        <div
          className={clsx(
            'NotifiIntercomChatMessageList__groupContainer',
            classNames?.container,
          )}
        >
          <img
            src={
              participantProfile?.avatarDataType === 'URL'
                ? participantProfile.avatarData
                : ''
            }
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
            }}
            className={clsx(
              'NotifiIntercomChatMessage__avatar',
              classNames?.avatar,
            )}
          />
          <MessageGroup
            classNames={classNames?.messageGroup}
            messages={feed.messages}
            direction={feed.direction}
          />
        </div>
      ) : (
        <>
          <MessageGroup
            classNames={classNames?.messageGroup}
            messages={feed.messages}
            direction={feed.direction}
          />
        </>
      )}
    </div>
  );
};
