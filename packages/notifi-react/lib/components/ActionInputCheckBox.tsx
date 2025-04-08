import { ActionInputCheckBox as ActionInputCheckBoxType } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

export type ActionInputCheckBoxProps = {
  input: ActionInputCheckBoxType;
  userInputId: number; // TODO: for exec action
  classNames?: {
    container?: string;
  };
};

export const ActionInputCheckBox: React.FC<ActionInputCheckBoxProps> = (
  props,
) => {
  const updateUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: implement update user input logic
  };
  return (
    <div
      className={clsx(
        'notifi-smartlink-action-input-checkbox-container',
        props.classNames?.container,
      )}
    >
      <input
        type="checkbox"
        required={props.input.isRequired}
        onChange={updateUserInput}
        // TODO: implement override default style
        className={clsx('notifi-smartlink-action-input-checkbox')}
      />
      <div>{props.input.title}</div>
    </div>
  );
};
