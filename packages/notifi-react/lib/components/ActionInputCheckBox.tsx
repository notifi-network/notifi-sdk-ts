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
    inputContainer?: string;
    input?: string;
  };
};

export const ActionInputCheckBox: React.FC<ActionInputCheckBoxProps> = (
  props,
) => {
  const { updateActionUserInputs, actionDictionary } =
    useNotifiSmartLinkContext();

  const value = React.useMemo(() => {
    return actionDictionary[props.smartLinkIdWithActionId].userInputs[
      props.userInputId
    ].userInput.value as boolean;
  }, [actionDictionary, props.smartLinkIdWithActionId, props.userInputId]);

  const validateAndUpdateActionInputs = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
        'notifi-smartlink-action-input-checkbox',
        props.classNames?.container,
      )}
    >
      <div
        className={clsx(
          'notifi-smartlink-action-input-checkbox-container',
          props.classNames?.inputContainer,
        )}
      >
        <input
          type="checkbox"
          checked={value}
          required={props.input.isRequired}
          onChange={validateAndUpdateActionInputs}
          className={clsx(
            'notifi-smartlink-action-input-checkbox-input',
            props.classNames?.input,
          )}
        />
        <div>{props.input.title}</div>
      </div>
    </div>
  );
};
