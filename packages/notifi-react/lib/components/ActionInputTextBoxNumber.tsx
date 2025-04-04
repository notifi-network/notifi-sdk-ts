import { ActionInputTextBox as ActionInput } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

export type ActionInputTextBoxNumberProps = {
  input: ActionInput<'NUMBER'>;
  userInputId?: string; // TODO: for exec action
  classNames?: {
    container?: string;
  };
};

export const ActionInputTextBoxNumber = ({
  input,
  userInputId,
  classNames,
}: ActionInputTextBoxNumberProps) => {
  return (
    <div
      className={clsx(
        'notifi-smartlink-action-text-input-number-container',
        // props.classNames?.textInputContainer,
      )}
    >
      <input
        type="number"
        placeholder={input.placeholder.toString()}
        defaultValue={input.default.toString()}
        min={input.constraintType?.min}
        max={input.constraintType?.max}
        className={clsx(
          'notifi-smartlink-action-text-input',
          // props.classNames?.input,
        )}
        onChange={(e) => {}}
      />
    </div>
  );
};
