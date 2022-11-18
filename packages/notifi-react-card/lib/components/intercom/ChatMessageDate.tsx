import clsx from 'clsx';
import React from 'react';

import {
  formatConversationDateTimestamp,
  formatConversationStartTimestamp,
} from '../../utils/datetimeUtils';

export type ChatMessageDateProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    content: string;
  }>;
  createdDate: string;
  isStartDate?: boolean;
}>;

export const ChatMessageDate: React.FC<ChatMessageDateProps> = ({
  classNames,
  createdDate,
  isStartDate = true,
}) => {
  return (
    <div
      className={clsx(
        'NotifiIntercomChatMessageDate__container',
        classNames?.container,
      )}
    >
      <div
        className={clsx(
          'NotifiIntercomChatMessageDate__content',
          classNames?.content,
        )}
      >
        {isStartDate
          ? formatConversationStartTimestamp(createdDate)
          : formatConversationDateTimestamp(createdDate)}
      </div>
    </div>
  );
};
