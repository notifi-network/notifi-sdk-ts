import { Icon } from '@/assets/Icon';
import { DeepPartialReadonly } from '@/utils/typeUtils';
import { useNotifiTargetContext } from '@notifi-network/notifi-react';
import React from 'react';

export type InputFieldEmailProps = Readonly<{
  copy?: DeepPartialReadonly<{
    placeholder: string;
    label: string;
  }>;
  disabled: boolean;
  hasChatAlert?: boolean;
  isEditable?: boolean;
}>;

export const InputFieldEmail: React.FC<InputFieldEmailProps> = ({
  copy,
  disabled,
  isEditable,
}: InputFieldEmailProps) => {
  const {
    updateTargetInputs,
    isChangingTargets,
    renewTargetGroup,
    targetDocument: {
      targetInputs: { email, telegram, slack },
    },
  } = useNotifiTargetContext();

  console.log('targetInputs', email, telegram, slack);
  const validateEmail = () => {
    if (email.value === '') {
      return;
    }
    const emailRegex = new RegExp(
      '^[a-zA-Z0-9._:$!%-+]+@[a-zA-Z0-9.-]+.[a-zA-Z]$',
    );
    if (emailRegex.test(email.value)) {
      updateTargetInputs('email', {
        value: email.value,
        error: '',
      });
    } else {
      updateTargetInputs('email', {
        value: email.value,
        error: `The email is invalid. Please try again.`,
      });
    }
  };

  const hasErrors = !!email.error;

  return (
    <div className="bg-notifi-destination-card-bg rounded-md w-full sm:w-112 h-18 flex flex-row items-center mb-2 gap-2 sm:gap-4">
      <div className="bg-notifi-destination-logo-card-bg rounded-md w-18 h-18 shadow-destinationCard text-notifi-destination-card-text flex flex-col items-center justify-center">
        <Icon
          id="email-icon"
          width="15px"
          height="12px"
          className="text-notifi-tenant-brand-bg"
        />
        <div className="font-medium text-xs mt-2 text-notifi-grey-text">
          Email
        </div>
      </div>
      <div className="relative w-3/4">
        <input
          className={`text-notifi-text border bg-notifi-card-bg rounded-md w-full sm:w-86 h-11 mr-4 text-sm pl-3 focus:border-notifi-input-border ${
            hasErrors ? 'border-notifi-error' : 'border-none'
          } flex ${hasErrors ? 'pt-3' : 'pt-0'}`}
          data-cy="notifiEmailInput"
          onBlur={validateEmail}
          disabled={disabled}
          onFocus={() =>
            updateTargetInputs('email', {
              value: email.value,
              error: '',
            })
          }
          name="notifi-email"
          type="email"
          value={email.value}
          onChange={(e) => {
            updateTargetInputs('email', {
              value: e.target.value,
              error: '',
            });
          }}
          placeholder={copy?.placeholder ?? 'Enter your email address'}
        />
        {hasErrors ? (
          <div className="absolute top-[5px] left-[11px] flex flex-col items-start">
            <p className="text-notifi-error text-xs block">{email.error}</p>
          </div>
        ) : null}
        {isEditable && isChangingTargets.email ? (
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
  );
};
