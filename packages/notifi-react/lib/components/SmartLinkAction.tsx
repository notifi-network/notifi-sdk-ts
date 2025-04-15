import {
  SmartLinkAction as Action,
  ActionInputParamsCheckBox as ActionInputCheckBoxType,
  ActionInputParams,
  ActionInputParamsTextBox,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

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
  action: Action;
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
  // TODO: impl useCallback
  const executeAction = async () => {
    if (props.preAction && props.preAction.isRequired) {
      return props.preAction.onClick();
    }
    // TODO: implement action execution logic
  };

  return (
    <div
      className={clsx('notifi-smartlink-action', props.classNames?.container)}
    >
      {props.action.inputs.map((input, id) => {
        // TODO: Extract to SmartLinkActionUserInput component
        if (isNumberTextBox(input)) {
          return (
            // TODO: impl classNames
            <ActionInputTextBoxNumber
              input={input}
              key={id}
              userInputId={id}
              classNames={props.classNames?.ActionInputTextBoxNumber}
            />
          );
        }
        if (isStringTextBox(input)) {
          return (
            // TODO: impl classNames
            <ActionInputTextBoxString
              input={input}
              key={id}
              userInputId={id}
              classNames={props.classNames?.ActionInputTextBoxString}
            />
          );
        }
        if (isCheckBox(input)) {
          return (
            // TODO: impl classNames
            <ActionInputCheckBox
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
      >
        {props.preAction && props.preAction.isRequired
          ? props.preAction.label
          : props.action.label}
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
