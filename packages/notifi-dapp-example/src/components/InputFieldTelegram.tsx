import { Icon } from '@/assets/Icon';
import { useNotifiTargets } from '@/hooks/useNotifiTargets';
import { useNotifiForm } from '@notifi-network/notifi-react-card';
import React from 'react';

export type InputFieldTelegramProps = Readonly<{
  disabled: boolean;
  hasChatAlert?: boolean;
  isEditable?: boolean;
}>;

export const InputFieldTelegram: React.FC<InputFieldTelegramProps> = ({
  disabled,
  isEditable,
}: InputFieldTelegramProps) => {
  const {
    formState,
    formErrorMessages,
    setTelegram,
    setTelegramErrorMessage,
    setHasTelegramChanges,
    hasTelegramChanges,
  } = useNotifiForm();

  const { telegram: telegramErrorMessage, email: emailErrorMessage } =
    formErrorMessages;
  const { updateTarget } = useNotifiTargets('telegram');

  const { telegram } = formState;

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

  const hasErrors = telegramErrorMessage !== '';

  return (
    <>
      <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="telegram-icon"
            width="16px"
            height="14px"
            className="text-notifi-button-primary-blueish-bg"
          />
          <div className="font-bold text-xs mt-2">Telegram</div>
        </div>
        <div className="relative">
          <input
            data-cy="notifiTelegramInput"
            onBlur={validateTelegram}
            className={`border border-grey-300 rounded-md w-86 h-11 mr-4 text-sm pl-3 focus:outline-none ${
              hasErrors ? 'border-notifi-error' : 'border-gray-300'
            } flex ${hasErrors ? 'pt-3' : 'pt-0'}`}
            disabled={disabled}
            name="notifi-telegram"
            type="text"
            value={telegram}
            onFocus={() => setTelegramErrorMessage('')}
            onChange={(e) => {
              setHasTelegramChanges(true);
              setTelegram(e.target.value ?? '');
            }}
            placeholder="Enter your telegram ID"
          />
          {hasErrors ? (
            <div className="absolute top-[5px] left-[11px] flex flex-col items-start">
              <p className="text-notifi-error text-xs block">
                {telegramErrorMessage}
              </p>
            </div>
          ) : null}
          {isEditable && hasTelegramChanges ? (
            <button
              className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-16 h-7 mb-6 text-sm font-bold absolute top-2.5 right-6 disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
              disabled={telegramErrorMessage !== '' || emailErrorMessage !== ''}
              onClick={updateTarget}
            >
              <span>save</span>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};
