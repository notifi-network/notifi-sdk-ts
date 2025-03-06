import {
  FormTarget,
  useNotifiTargetContext,
} from '@notifi-network/notifi-react';
import React, { useMemo } from 'react';

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

  const targetToBeSaved = useMemo(() => {
    switch (props.targetType) {
      case 'email':
        return targetInputs.email;
      case 'phoneNumber':
        return targetInputs.phoneNumber;
    }
  }, [props.targetType, targetInputs]);

  const inputPlaceholder =
    props.targetType === 'email' ? 'Enter your email address' : 'Phone Number';

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
    // <div
    //   data-cy={`notifi-target-input-${props.targetType}`}
    //   className={clsx('notifi-target-input-field', props.classNames?.container)}
    // >
    //   {props.copy?.label ? (
    //     <label
    //       className={clsx(
    //         'notifi-target-input-field-label',
    //         props.classNames?.label,
    //       )}
    //     >
    //       {props.copy.label}
    //     </label>
    //   ) : null}
    // <div
    //   className={`notifi-inputField text-notifi-text border bg-notifi-card-bg rounded-md w-full sm:w-86 h-11 mr-4 text-sm pl-3 focus:border-solid focus:border-blue-800 focus:outline-none ${
    //     isShowingInvalidWarning ? 'border-notifi-error' : 'border-none'
    //   } flex ${isShowingInvalidWarning ? 'pt-3' : 'pt-0'}`}
    // >
    <div>
      <input
        type={
          props.targetType === 'email'
            ? 'email'
            : props.targetType === 'phoneNumber'
              ? 'tel'
              : 'text'
        }
        className={`text-notifi-text border bg-notifi-card-bg rounded-3xl w-full sm:w-72 h-11 text-sm pl-3 focus:border-solid focus:border-blue-800 focus:outline-none ${
          isShowingInvalidWarning ? 'border-notifi-error' : 'border-none'
        } flex ${isShowingInvalidWarning ? 'pt-3' : 'pt-0'}`}
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
            error: `Please enter a valid ${props.targetType} address`,
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
      {isShowingInvalidWarning ? (
        <div className="absolute top-[5px] left-[11px] flex flex-col items-start">
          <p className="text-notifi-error text-xs block">
            {targetToBeSaved.error}
          </p>
        </div>
      ) : null}
    </div>
    // </div>
  );
};
