import clsx from 'clsx';
import React, { useMemo } from 'react';

import { Icon, IconType } from '../assets/Icons';
import { FormTarget, useNotifiTargetContext } from '../context';
import { defaultCopy } from '../utils/constants';

export type TargetInputFieldProps = {
  targetType: FormTarget;
  onFocus?: (target: FormTarget) => void;
  onBlur?: (target: FormTarget) => void;
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
  };
};

export const TargetInputField: React.FC<TargetInputFieldProps> = (props) => {
  const {
    targetDocument: { targetInputs, targetData },
    updateTargetInputs,
  } = useNotifiTargetContext();
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  const [isShowingInvalidWarning, setIsShowingInvalidWarning] =
    React.useState(false);

  React.useEffect(() => {
    updateTargetInputs(props.targetType, {
      value: targetData?.[props.targetType] ?? '',
    });
    setIsShowingInvalidWarning(false);
  }, []);

  // TODO: Need refactor: consolidate or deprecate targetEdit logic
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
    (props.copy?.placeholder ?? props.targetType === 'email')
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
      data-cy={`notifi-target-input-${props.targetType}`}
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
          isInputFocused ? 'focused' : '',
          // NOTE: Now we only show error for invalid email input
          isShowingInvalidWarning ? 'warning' : '',
        )}
      >
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
            // TODO: consider if this section still needed (may deprecate isTargetValid method)
            if (isTargetValid(targetInput)) {
              updateTargetInputs(props.targetType, {
                value: targetInput,
                error: '',
              });
              return;
            }
            updateTargetInputs(props.targetType, {
              value: targetInput,
              error: defaultCopy.targetInputField.inValidErrorMessage(
                props.targetType,
              ),
            });
          }}
          onFocus={() => {
            setIsInputFocused(true);
            setIsShowingInvalidWarning(false);
            props.onFocus?.(props.targetType);
          }}
          onBlur={() => {
            setIsInputFocused(false);
            props.onBlur?.(props.targetType);
            if (targetToBeSaved.error) {
              if (props.targetType === 'email') {
                // NOTE: Now we only show error for invalid email input
                setIsShowingInvalidWarning(true);
              }
            }
          }}
          placeholder={inputPlaceholder}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};
