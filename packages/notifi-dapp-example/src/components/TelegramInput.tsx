import { Icon } from '@/assets/Icon';
import { useNotifiForm } from '@notifi-network/notifi-react-card';
import React from 'react';

export type TelegramInputProps = Readonly<{
  disabled: boolean;
  hasChatAlert?: boolean;
}>;

export const TelegramInput: React.FC<TelegramInputProps> = ({
  disabled,
}: TelegramInputProps) => {
  const {
    formState,
    formErrorMessages,
    setTelegram,
    setTelegramErrorMessage,
    setHasChanges,
  } = useNotifiForm();

  const { telegram } = formState;

  const { telegram: telegramErrorMessage } = formErrorMessages;

  const validateTelegram = () => {
    if (telegram === '') {
      return;
    }

    const TelegramRegex =
      /^@?(?=\w{5,32}\b)[a-zA-Z0-9]+(?:[a-zA-Z0-9_ ]+[a-zA-Z0-9])*$/;

    if (TelegramRegex.test(telegram)) {
      setTelegramErrorMessage('');
    } else {
      setTelegramErrorMessage('The telegram is invalid. Please try again.');
    }
  };

  return (
    <>
      <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="telegram-icon"
            width="16px"
            height="14px"
            className="text-notifi-toggle-on-bg"
          />
          <div className="font-bold text-xs mt-2">Telegram</div>
        </div>
        <div className="flex flex-row items-center justify-between w-90 mr-4">
          <input
            data-cy="notifiTelegramInput"
            onBlur={validateTelegram}
            className="border border-grey-300 rounded-md w-86 h-11 mr-4 text-sm pl-3"
            disabled={disabled}
            name="notifi-telegram"
            type="text"
            value={telegram}
            onFocus={() => setTelegramErrorMessage('')}
            onChange={(e) => {
              setHasChanges(true);
              setTelegram(e.target.value ?? '');
            }}
            placeholder="Enter your telegram ID"
          />
        </div>
      </div>
      <label>{telegramErrorMessage}</label>
    </>
  );
};
