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
  userInputId: number; // TODO: for exec action
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
  // TODO: implement useCallback and more proper name
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onChange={handleChange}
        onBlur={() => value === '' && setIsValid(true)}
        value={value}
      />
    </div>
  );
};
