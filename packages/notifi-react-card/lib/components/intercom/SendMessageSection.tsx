import clsx from 'clsx';
import React, { useState } from 'react';

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
  const [sendMessage, setSendMessage] = useState<string>('');
  const disabled = sendMessage === '' || sendMessage === undefined;

  const handleSend = () => {
    sendConversationMessages(sendMessage);
    setSendMessage('');
  };
  return (
    <div
      className={clsx(
        'NotifiIntercomSendMessageSection__container',
        classNames?.container,
      )}
    >
      <textarea
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
