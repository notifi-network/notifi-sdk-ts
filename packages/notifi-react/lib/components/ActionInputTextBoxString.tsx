import { ActionInputTextBox } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

export type ActionInputTextBoxStringProps = {
  input: ActionInputTextBox<'TEXT'>;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const isInputValid = input.checkValidity();
    const isPatternValid = new RegExp(
      props.input.constraintType?.pattern || '',
    );
    const isConstraintMet = isInputValid && isPatternValid.test(input.value);
    if (isConstraintMet) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }

    setValue(input.value);
    // TODO: implement update user input logic
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
        defaultValue={props.input.default.toString()}
        maxLength={props.input.constraintType?.maxLength}
        minLength={props.input.constraintType?.minLength}
        className={clsx(
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
