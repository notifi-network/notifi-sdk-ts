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
  userInputId: number;
  classNames?: {
    container?: string;
    input?: string;
  };
};

export const ActionInputCheckBox: React.FC<ActionInputCheckBoxProps> = (
  props,
) => {
  const { updateActionUserInputs, actionDictionary } =
    useNotifiSmartLinkContext();

  const defaultValue = actionDictionary[props.smartLinkIdWithActionId]
    .userInputs[props.userInputId].userInput.value as boolean;
  const [value, setValue] = React.useState<boolean>(defaultValue);
  const validateAndUpdateActionInputs = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = e.target.checked;
    setValue(isChecked);
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
        checked={value}
        required={props.input.isRequired}
        onChange={validateAndUpdateActionInputs}
        className={clsx(
          'notifi-smartlink-action-input-checkbox',
          props.classNames?.input,
        )}
      />
      <div>{props.input.title}</div>
    </div>
  );
};
