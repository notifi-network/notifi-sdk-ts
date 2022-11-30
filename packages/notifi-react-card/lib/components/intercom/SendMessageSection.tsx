import clsx from 'clsx';
import React, { useCallback, useState } from 'react';

export type SendMessageSectionProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    textarea: string;
    button: string;
  }>;
  sendConversationMessages: (message: string) => void;
}>;

export const SendMessageSection: React.FC<SendMessageSectionProps> = ({
  classNames,
  sendConversationMessages,
}) => {
  const [sendMessage, setSendMessage] = useState<string | undefined>(undefined);
  const disabled = sendMessage === '' || sendMessage === undefined;

  const handleSend = () => {
    if (sendMessage) {
      sendConversationMessages(sendMessage);
      setSendMessage('');
    }
  };

  const handleKeypressDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        handleSend();
        event.preventDefault();
      }
    },
    [handleSend],
  );

  return (
    <div
      className={clsx(
        'NotifiIntercomSendMessageSection__container',
        classNames?.container,
      )}
    >
      <textarea
        onKeyDown={handleKeypressDown}
        className={clsx(
          'NotifiIntercomSendMessageSection__textarea',
          classNames?.textarea,
        )}
        value={sendMessage}
        onChange={(e) => {
          setSendMessage(e.target.value ?? '');
        }}
        placeholder={'Write a message...'}
      />
      <button
        disabled={disabled}
        onClick={handleSend}
        className={clsx(
          'NotifiIntercomSendMessageSection__button',
          classNames?.button,
        )}
      >
        Send
      </button>
    </div>
  );
};
