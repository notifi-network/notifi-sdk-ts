import clsx from 'clsx';
import React, { useMemo } from 'react';

import { Icon, IconType } from '../assets/Icons';
import { Target, useNotifiTargetContext } from '../context';
import { defaultCopy } from '../utils/constants';

export type TargetInputFieldProps = {
  targetType: Extract<Target, 'email' | 'telegram' | 'phoneNumber'>;
  iconType: IconType;
  validateRegex?: RegExp;
  copy?: {
    placeholder?: string;
    label?: string;
  };
  disabled?: boolean;
  classNames?: {
    container?: string;
    label?: string;
    icon?: string;
    input?: string;
    errorMessage?: string;
  };
};

export const TargetInputField: React.FC<TargetInputFieldProps> = (props) => {
  const {
    targetDocument: { targetInputs },
    updateTargetInputs,
  } = useNotifiTargetContext();

  const [isDisplayingErrorMsg, setIsDisplayingErrorMsg] = React.useState(false);

  const targetToBeSaved = useMemo(() => {
    switch (props.targetType) {
      case 'email':
        return targetInputs.email;
      case 'phoneNumber':
        return targetInputs.phoneNumber;
      case 'telegram':
        return targetInputs.telegram;
    }
  }, [props.targetType, targetInputs]);

  const inputPlaceholder =
    props.copy?.placeholder ?? props.targetType === 'email'
      ? defaultCopy.inputFields.email
      : props.targetType === 'phoneNumber'
      ? defaultCopy.inputFields.phoneNumber
      : defaultCopy.inputFields.telegram;

  const isTargetValid = (targetInput: string) => {
    if (targetInput === '' || !props.validateRegex) {
      return true;
    }

    if (props.validateRegex.test(targetInput)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div
      className={clsx('notifi-target-input-field', props.classNames?.container)}
    >
      {props.copy?.label ? (
        <label
          className={clsx(
            'notifi-target-input-field-label',
            props.classNames?.label,
          )}
        >
          {props.copy.label}
        </label>
      ) : null}
      <div
        className={clsx(
          'notifi-target-input-field-input-container',
          props.classNames?.container,
        )}
      >
        <Icon
          type={props.iconType}
          className={clsx(
            'notifi-target-input-field-icon',
            props.classNames?.icon,
          )}
        />
        <input
          type={
            props.targetType === 'email'
              ? 'email'
              : props.targetType === 'phoneNumber'
              ? 'tel'
              : 'text'
          }
          className={clsx(
            'notifi-target-input-field-input',
            props.classNames?.input,
          )}
          value={targetToBeSaved.value}
          onChange={(evt) => {
            const targetInput = evt.target.value;
            if (isTargetValid(targetInput)) {
              updateTargetInputs(props.targetType, {
                value: targetInput,
                error: '',
              });
              return;
            }
            updateTargetInputs(props.targetType, {
              value: targetInput,
              error: `The ${props.targetType} is invalid. Please try again.`,
            });
          }}
          onFocus={() => setIsDisplayingErrorMsg(false)}
          onBlur={() => {
            if (targetToBeSaved.error) {
              setIsDisplayingErrorMsg(true);
            }
          }}
          placeholder={inputPlaceholder}
          disabled={props.disabled}
        />
      </div>
      {isDisplayingErrorMsg ? (
        <div
          className={clsx(
            'notifi-target-input-field-error-message',
            props.classNames?.errorMessage,
          )}
        >
          {targetToBeSaved.error}
        </div>
      ) : null}
    </div>
  );
};
