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
    inputContainer?: string;
    input?: string;
  };
};

export const ActionInputTextBoxString: React.FC<
  ActionInputTextBoxStringProps
> = (props) => {
  const [isValid, setIsValid] = React.useState<boolean>(true);
  const { updateActionUserInputs, actionDictionary } =
    useNotifiSmartLinkContext();

  const value = React.useMemo(() => {
    return actionDictionary[props.smartLinkIdWithActionId].userInputs[
      props.userInputId
    ].userInput.value as string | '';
  }, [actionDictionary, props.smartLinkIdWithActionId, props.userInputId]);

  const validateAndUpdateActionInputs = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    const isInputValid = input.checkValidity();
    const isPatternValid = new RegExp(
      props.input.constraintType?.pattern || '',
    );
    const isConstraintMet = props.input.isRequired
      ? /* If the input is required, check if the input is valid and the pattern matches */
        isInputValid && isPatternValid.test(input.value) && input.value !== ''
      : /* If the input is NOT required, check if the pattern matches or the input is empty */
        isPatternValid.test(input.value) || input.value === '';

    setIsValid(isConstraintMet);

    updateActionUserInputs(props.smartLinkIdWithActionId, {
      [props.userInputId]: {
        userInput: {
          id: props.input.id,
          type: 'TEXTBOX',
          value: input.value,
        },
        isValid: isConstraintMet,
      },
    });
  };
  return (
    <div
      className={clsx(
        'notifi-smartlink-action-input-textbox',
        props.classNames?.container,
      )}
    >
      <div
        className={clsx(
          'notifi-smartlink-action-input-textbox-container',
          props.classNames?.inputContainer,
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
          placeholder={props.input.placeholder?.toString() ?? ''}
          maxLength={props.input.constraintType?.maxLength}
          minLength={props.input.constraintType?.minLength}
          className={clsx(
            'clean-input',
            'notifi-smartlink-action-input-textbox-input',
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
    </div>
  );
};
