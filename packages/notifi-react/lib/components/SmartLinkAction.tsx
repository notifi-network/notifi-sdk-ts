import {
  ActionInputParamsCheckBox as ActionInputCheckBoxType,
  ActionInputParams,
  ActionInputParamsTextBox,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import {
  type SmartLinkIdWithActionId,
  useNotifiSmartLinkContext,
} from '../context';
import {
  ActionInputCheckBox,
  ActionInputCheckBoxProps,
} from './ActionInputCheckBox';
import {
  ActionInputTextBoxNumber,
  ActionInputTextBoxNumberProps,
} from './ActionInputTextBoxNumber';
import {
  ActionInputTextBoxString,
  ActionInputTextBoxStringProps,
} from './ActionInputTextBoxString';

export type PreAction = {
  isRequired: boolean;
  label: string;
  onClick: () => Promise<void>;
};

export type SmartLinkActionProps = {
  smartLinkIdWithActionId: SmartLinkIdWithActionId;
  preAction?: PreAction;
  classNames?: {
    container?: string;
    textInputContainer?: string;
    checkboxContainer?: string;
    ActionInputTextBoxNumber?: ActionInputTextBoxNumberProps['classNames'];
    ActionInputTextBoxString?: ActionInputTextBoxStringProps['classNames'];
    ActionInputCheckBox?: ActionInputCheckBoxProps['classNames'];
  };
};

export const SmartLinkAction: React.FC<SmartLinkActionProps> = (props) => {
  const { actionDictionary } = useNotifiSmartLinkContext();
  // TODO: impl useCallback
  const executeAction = async () => {
    if (props.preAction && props.preAction.isRequired) {
      return props.preAction.onClick();
    }
    const [smartLinkId, actionId] = props.smartLinkIdWithActionId.split(':;:');
    console.log({ smartLinkId, actionId });
    // TODO: implement action execution logic
  };
  const action = actionDictionary[props.smartLinkIdWithActionId].action;

  const isButtonEnabled = React.useMemo(() => {
    const userInputs =
      actionDictionary[props.smartLinkIdWithActionId].userInputs;
    return Object.values(userInputs)
      .map((userInput) => userInput.isValid)
      .every((isValid) => isValid);
  }, [actionDictionary, props.smartLinkIdWithActionId]);

  return (
    <div
      className={clsx('notifi-smartlink-action', props.classNames?.container)}
    >
      {action.inputs.map((input, id) => {
        if (isNumberTextBox(input)) {
          return (
            <ActionInputTextBoxNumber
              smartLinkIdWithActionId={props.smartLinkIdWithActionId}
              input={input}
              key={id}
              userInputId={id}
              classNames={props.classNames?.ActionInputTextBoxNumber}
            />
          );
        }
        if (isStringTextBox(input)) {
          return (
            <ActionInputTextBoxString
              smartLinkIdWithActionId={props.smartLinkIdWithActionId}
              input={input}
              key={id}
              userInputId={id}
              classNames={props.classNames?.ActionInputTextBoxString}
            />
          );
        }
        if (isCheckBox(input)) {
          return (
            <ActionInputCheckBox
              smartLinkIdWithActionId={props.smartLinkIdWithActionId}
              input={input}
              key={id}
              userInputId={id}
              classNames={props.classNames?.ActionInputCheckBox}
            />
          );
        }
        return null;
      })}
      <button
        className={clsx('btn', 'notifi-smartlink-action-btn')}
        onClick={executeAction}
        disabled={!isButtonEnabled}
      >
        {props.preAction && props.preAction.isRequired
          ? props.preAction.label
          : action.label}
      </button>
    </div>
  );
};

// Utils
// TODO: move to utils?
const isNumberTextBox = (
  input: ActionInputParams,
): input is ActionInputParamsTextBox<'NUMBER'> => {
  if (input.type !== 'TEXTBOX') {
    return false;
  }
  return input.inputType === 'NUMBER';
};

const isStringTextBox = (
  input: ActionInputParams,
): input is ActionInputParamsTextBox<'TEXT'> => {
  if (input.type !== 'TEXTBOX') {
    return false;
  }
  return input.inputType === 'TEXT';
};
const isCheckBox = (
  input: ActionInputParams,
): input is ActionInputCheckBoxType => {
  if (input.type !== 'CHECKBOX') {
    return false;
  }
  return input.type === 'CHECKBOX';
};
