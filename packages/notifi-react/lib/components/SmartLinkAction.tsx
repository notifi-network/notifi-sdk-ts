import { SmartLinkActionUserInput } from '@notifi-network/notifi-dataplane';
import {
  ActionInputParamsCheckBox as ActionInputCheckBoxType,
  ActionInputParams,
  ActionInputParamsTextBox,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import {
  type ActionHandler,
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
  disabled: boolean;
  label: string;
  onClick: () => Promise<void>;
};

export type SmartLinkActionProps = {
  smartLinkIdWithActionId: SmartLinkIdWithActionId;
  preAction?: PreAction;
  actionHandler: ActionHandler;
  copy?: {
    inactiveLabel: string;
  };
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
  const {
    actionDictionary,
    executeSmartLinkAction,
    smartLinkConfigDictionary,
  } = useNotifiSmartLinkContext();

  const [smartLinkId, actionId] = props.smartLinkIdWithActionId.split(':;:');

  const executeAction = React.useCallback(async () => {
    if (!smartLinkConfigDictionary[smartLinkId].isActive) return;

    const inputsWithValidation =
      actionDictionary[props.smartLinkIdWithActionId].userInputs;

    const actionUserInputs = Object.values(inputsWithValidation).reduce(
      (
        acc: Record<number, SmartLinkActionUserInput>,
        inputWithValidation,
        id,
      ) => {
        acc[id] = inputWithValidation.userInput;
        return acc;
      },
      {},
    );

    // TODO: remove below before merging into main
    console.log({ smartLinkId, actionId, actionUserInputs });

    /* ⬇ ERROR already handled within context */
    await executeSmartLinkAction({
      smartLinkId,
      actionId,
      inputs: actionUserInputs,
      execute: props.actionHandler,
    });
  }, [
    actionDictionary,
    props.actionHandler,
    props.smartLinkIdWithActionId,
    executeSmartLinkAction,
  ]);

  const action = actionDictionary[props.smartLinkIdWithActionId].action;

  const isButtonEnabled = React.useMemo(() => {
    if (!smartLinkConfigDictionary[smartLinkId].isActive) return false;
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

      {props.preAction ? (
        /* Pre Action Button */
        <button
          className={clsx('btn', 'notifi-smartlink-action-btn')}
          onClick={() => props.preAction!.onClick()}
          disabled={props.preAction.disabled}
        >
          {props.preAction.label}
        </button>
      ) : (
        /* Main Action Button */
        <button
          className={clsx('btn', 'notifi-smartlink-action-btn')}
          onClick={executeAction}
          disabled={!isButtonEnabled}
        >
          {!smartLinkConfigDictionary[smartLinkId].isActive
            ? (props.copy?.inactiveLabel ?? 'Unavailable')
            : action.label}
        </button>
      )}
    </div>
  );
};

// Utils
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
