import clsx from 'clsx';
import React from 'react';

export type ChatMessageDateProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    content: string;
  }>;
  date?: string;
}>;

export const ChatMessageDate: React.FC<ChatMessageDateProps> = ({
  classNames,
  date = 'August 1',
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
        {date}
      </div>
    </div>
  );
};
