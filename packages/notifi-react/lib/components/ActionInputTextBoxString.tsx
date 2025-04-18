import { ActionInputParamsTextBox } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import {
  type SmartLinkIdWithActionId,
  useNotifiSmartLinkContext,
} from '../context';

export type ActionInputTextBoxStringProps = {
  input: ActionInputParamsTextBox<'TEXT'>;
  smartLinkIdWithActionId: SmartLinkIdWithActionId;
  userInputId: number;
  classNames?: {
    container?: string;
    input?: string;
  };
};

export const ActionInputTextBoxString: React.FC<
  ActionInputTextBoxStringProps
> = (props) => {
  const [value, setValue] = React.useState<string>(props.input.default);
  const [isValid, setIsValid] = React.useState<boolean>(true);
  const { updateActionUserInputs } = useNotifiSmartLinkContext();
  React.useEffect(() => {
    /* Reset input field when being unmounted */
    return () => {
      updateActionUserInputs(props.smartLinkIdWithActionId, {
        [props.userInputId]: {
          userInput: {
            type: 'TEXTBOX',
            value: '',
            id: props.input.id,
          },
          isValid: false,
        },
      });
    };
  }, []);

  const validateAndUpdateActionInputs = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    const isInputValid = input.checkValidity();
    const isPatternValid = new RegExp(
      props.input.constraintType?.pattern || '',
    );
    const isConstraintMet = isInputValid && isPatternValid.test(input.value);
    setIsValid(isConstraintMet);

    setValue(input.value);
    updateActionUserInputs(props.smartLinkIdWithActionId, {
      [props.userInputId]: {
        userInput: {
          id: props.input.id,
          type: 'TEXTBOX',
          value: input.value,
        },
        isValid: props.input.isRequired ? isConstraintMet : true,
      },
    });
  };
  return (
    <div
      className={clsx(
        'notifi-smartlink-action-input-textbox-container',
        props.classNames?.container,
        !isValid && 'invalid',
      )}
    >
      {props.input.prefix ? (
        /* No class override, only support default className */
        <div className="notifi-smartlink-action-input-textbox-prefix">
          {props.input.prefix}
        </div>
      ) : null}
      <input
        type="text"
        placeholder={props.input.placeholder.toString()}
        maxLength={props.input.constraintType?.maxLength}
        minLength={props.input.constraintType?.minLength}
        className={clsx(
          'clean-input',
          'notifi-smartlink-action-input-textbox',
          props.classNames?.input,
        )}
        onChange={validateAndUpdateActionInputs}
        onBlur={() => value === '' && setIsValid(true)}
        value={value}
      />
      {props.input.suffix ? (
        /* No class override, only support default className */
        <div className="notifi-smartlink-action-input-textbox-suffix">
          {props.input.suffix}
        </div>
      ) : null}
    </div>
  );
};
