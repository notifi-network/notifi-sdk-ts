import clsx from 'clsx';
import React, { useState } from 'react';

export type SendMessageSectionProps = Readonly<{
  classNames?: Readonly<{
    container: string;
    textArea: string;
    button: string;
  }>;
}>;

export const SendMessageSection: React.FC<SendMessageSectionProps> = ({
  classNames,
}) => {
  const [sendMessage, setSendMessage] = useState<string>('');
  const disabled = sendMessage === '' || sendMessage === undefined;
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
          classNames?.textArea,
        )}
        value={sendMessage}
        onChange={(e) => {
          setSendMessage(e.target.value ?? '');
        }}
        placeholder={'Write a message...'}
      />
      <button
        disabled={disabled}
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
