import { Icon } from '@/assets/Icon';
import { useNotifiTargetContext } from '@notifi-network/notifi-react';
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
    isChangingTargets,
    updateTargetInputs,
    renewTargetGroup,
    targetDocument: {
      targetData,
      targetInputs: { email, telegram },
    },
  } = useNotifiTargetContext();
  // const {
  //   updateTarget,
  //   setHasTelegramChanges,
  //   hasTelegramChanges,
  //   updateTargetForms,
  //   targetDocument: {
  //     targetInputForm: { email, telegram },
  //   },
  // } = useNotifiTargetContext();

  const validateTelegram = () => {
    if (telegram.value === '') {
      return;
    }

    const TelegramRegex =
      /^@?(?=\w{5,32}\b)[a-zA-Z0-9]+(?:[a-zA-Z0-9_ ]+[a-zA-Z0-9])*$/;

    if (TelegramRegex.test(telegram.value)) {
      updateTargetInputs('telegram', {
        value: telegram.value,
        error: '',
      });
    } else {
      updateTargetInputs('telegram', {
        value: telegram.value,
        error: 'The telegram is invalid. Please try again.',
      });
    }
  };

  const hasErrors = !!telegram.error;

  return (
    <>
      <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center mb-2 gap-2 sm:gap-4">
        <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="telegram-icon"
            width="16px"
            height="14px"
            className="text-notifi-tenant-brand-bg"
          />
          <div className="font-medium text-xs mt-2 text-notifi-grey-text">
            Telegram
          </div>
        </div>
        <div className="relative w-3/4">
          <input
            data-cy="notifiTelegramInput"
            onBlur={validateTelegram}
            className={`text-notifi-text border bg-notifi-card-bg border-grey-300 rounded-md w-full sm:w-86 h-11 mr-4 text-sm pl-3 focus:outline-none focus:border-notifi-input-border ${
              hasErrors ? 'border-notifi-error' : 'border-none'
            } flex ${hasErrors ? 'pt-3' : 'pt-0'}`}
            disabled={disabled}
            name="notifi-telegram"
            type="text"
            value={telegram.value}
            onFocus={() =>
              updateTargetInputs('telegram', {
                value: telegram.value,
                error: '',
              })
            }
            onChange={(e) => {
              updateTargetInputs('telegram', {
                value: e.target.value,
                error: '',
              });
            }}
            placeholder="Enter your telegram ID"
          />
          {hasErrors ? (
            <div className="absolute top-[5px] left-[11px] flex flex-col items-start">
              <p className="text-notifi-error text-xs block">
                {telegram.error}
              </p>
            </div>
          ) : null}
          {isEditable && isChangingTargets.telegram ? (
            <button
              className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-16 h-7 mb-6 text-sm font-medium absolute top-2.5 right-1 disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
              disabled={!!telegram.error || !!email.error}
              onClick={() => renewTargetGroup()}
            >
              <span>Save</span>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};
