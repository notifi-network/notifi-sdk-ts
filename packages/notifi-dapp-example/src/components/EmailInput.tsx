import { Icon } from '@/assets/Icon';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { TargetGroupData, useNotifiTargets } from '@/hooks/useNotifiTargets';
import { formatTelegramForSubscription } from '@/utils/stringUtils';
import {
  DeepPartialReadonly,
  useNotifiClientContext,
  useNotifiForm,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { isValidPhoneNumber } from 'libphonenumber-js';
import React, { useCallback, useMemo } from 'react';

export type EmailInputProps = Readonly<{
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
  hasChatAlert?: boolean;
  isEdit?: boolean;
}>;

export const EmailInput: React.FC<EmailInputProps> = ({
  copy,
  disabled,
  isEdit,
}: EmailInputProps) => {
  const {
    formState,
    formErrorMessages,
    setEmail,
    setEmailErrorMessage,
    setHasEmailChanges,
    hasEmailChanges,
  } = useNotifiForm();

  const { cardConfig } = useNotifiCardContext();
  const { setIsGlobalLoading, setGlobalError } = useGlobalStateContext();

  const { email: emailErrorMessage } = formErrorMessages;
  const { frontendClient } = useNotifiClientContext();
  const { renewTargetGroups } = useNotifiTargets();

  const { phoneNumber, telegram: telegramId, email } = formState;
  const { useDiscord, render } = useNotifiSubscriptionContext();

  const targetGroup: TargetGroupData = useMemo(
    () => ({
      name: 'Default',
      emailAddress: email === '' ? undefined : email,
      phoneNumber: isValidPhoneNumber(phoneNumber) ? phoneNumber : undefined,
      telegramId:
        telegramId === ''
          ? undefined
          : formatTelegramForSubscription(telegramId),
      discordId: useDiscord ? 'Default' : undefined,
    }),
    [email, phoneNumber, telegramId, useDiscord],
  );
  const validateEmail = () => {
    if (email === '') {
      return;
    }

    const emailRegex = new RegExp(
      '^[a-zA-Z0-9._:$!%-+]+@[a-zA-Z0-9.-]+.[a-zA-Z]$',
    );
    if (emailRegex.test(email)) {
      setEmailErrorMessage('');
    } else {
      setEmailErrorMessage('The email is invalid. Please try again.');
    }
  };

  const updateTarget = useCallback(async () => {
    setIsGlobalLoading(true);
    try {
      let success = false;
      const result = await renewTargetGroups(targetGroup);
      success = !!result;

      if (success) {
        const newData = await frontendClient.fetchData();
        render(newData);
        setHasEmailChanges(false);
      }
    } catch (e: unknown) {
      setGlobalError('ERROR: Failed to save, check console for more details');
      console.error('Failed to singup', (e as Error).message);
    }
    setIsGlobalLoading(false);
  }, [frontendClient, setGlobalError, targetGroup]);

  const hasErrors = emailErrorMessage !== '';
  const isInputFieldsValid = useMemo(() => {
    return cardConfig.isContactInfoRequired ? email : true;
  }, [email, cardConfig.isContactInfoRequired]);

  return (
    <>
      <div className="bg-notifi-card-bg rounded-md w-112 h-18 flex flex-row items-center justify-between mb-2">
        <div className="bg-white rounded-md w-18 h-18 shadow-card text-notifi-destination-card-text flex flex-col items-center justify-center">
          <Icon
            id="email-icon"
            width="15px"
            height="12px"
            className="text-notifi-button-primary-blueish-bg"
          />
          <div className="font-bold text-xs mt-2">Email</div>
        </div>
        <div className="relative">
          <input
            className={`border rounded-md w-86 h-11 mr-4 text-sm pl-3 focus:outline-none index-10 ${
              hasErrors ? 'border-notifi-error' : 'border-gray-300'
            } flex ${hasErrors ? 'pt-3' : 'pt-0'}`}
            data-cy="notifiEmailInput"
            onBlur={validateEmail}
            disabled={disabled}
            onFocus={() => setEmailErrorMessage('')}
            name="notifi-email"
            type="email"
            value={email}
            onChange={(e) => {
              setHasEmailChanges(true);
              setEmail(e.target.value ?? '');
            }}
            placeholder={copy?.placeholder ?? 'Enter your email address'}
          />
          {hasErrors ? (
            <div className="absolute top-[5px] left-[11px] flex flex-col items-start">
              <p className="text-notifi-error text-xs block">
                {emailErrorMessage}
              </p>
            </div>
          ) : null}
          {isEdit && hasEmailChanges ? (
            <button
              className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-16 h-7 mb-6 text-sm font-bold absolute top-2.5 right-6 disabled:opacity-50 disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
              disabled={
                emailErrorMessage !== '' ||
                !email ||
                hasErrors ||
                !isInputFieldsValid
              }
              onClick={() => updateTarget()}
            >
              <span>save</span>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};
