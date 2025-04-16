import { ActionInputParamsCheckBox as ActionInputCheckBoxType } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import {
  type SmartLinkIdWithActionId,
  useNotifiSmartLinkContext,
} from '../context';

export type ActionInputCheckBoxProps = {
  input: ActionInputCheckBoxType;
  smartLinkIdWithActionId: SmartLinkIdWithActionId;
  userInputId: number; // TODO: for exec action
  classNames?: {
    container?: string;
    input?: string;
  };
};

export const ActionInputCheckBox: React.FC<ActionInputCheckBoxProps> = (
  props,
) => {
  const { updateActionUserInputs } = useNotifiSmartLinkContext();
  // TODO: implement useCallback
  const updateUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO: implement update user input logic
    const isChecked = e.target.checked;
    updateActionUserInputs(props.smartLinkIdWithActionId, {
      [props.userInputId]: {
        userInput: {
          type: 'CHECKBOX',
          value: isChecked,
          id: props.input.id,
        },
        isValid: props.input.isRequired ? isChecked : true,
      },
    });
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
        className={clsx(
          'notifi-smartlink-action-input-checkbox',
          props.classNames?.input,
        )}
      />
      <div>{props.input.title}</div>
    </div>
  );
};
