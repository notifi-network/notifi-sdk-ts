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
import { LoadingAnimation } from './LoadingAnimation';

export type PreAction = {
  disabled: boolean;
  label: string;
  onClick: () => Promise<void>;
  onError?: (e: Error) => void;
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
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    actionDictionary,
    executeSmartLinkAction,
    smartLinkConfigDictionary,
  } = useNotifiSmartLinkContext();

  const [smartLinkId, actionId] = props.smartLinkIdWithActionId.split(':;:');

  const executePreAction = React.useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await props.preAction!.onClick();
    } catch (e) {
      props.preAction!.onError?.(e as Error);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [props.preAction]);

  const executeAction = React.useCallback(async () => {
    if (!smartLinkConfigDictionary[smartLinkId].isActive) return;
    if (isLoading) return;

    const inputsWithValidation =
      actionDictionary[props.smartLinkIdWithActionId].userInputs;

    const actionUserInputs = Object.values(inputsWithValidation).reduce(
      (
        acc: Record<number, SmartLinkActionUserInput>,
        inputWithValidation,
        id,
      ) => {
        /* ⬇ If the TEXTBOX type input is not required and the user input is init value (''), set it to the default value. NOTE: CheckBox init value = false */
        const inputParams =
          actionDictionary[props.smartLinkIdWithActionId].action.inputs[id];
        if (
          !inputParams.isRequired &&
          inputWithValidation.userInput.value === ''
        ) {
          const defaultValue = getTextBoxDefaultValue(inputParams);
          acc[id] = {
            ...inputWithValidation.userInput,
            value: defaultValue,
          };
        }
        /* ⬇ ELSE, set the user input value */
        acc[id] = inputWithValidation.userInput;
        return acc;
      },
      {},
    );
    setIsLoading(true);
    /* ⬇ ERROR already handled within context */
    await executeSmartLinkAction({
      smartLinkId,
      actionId,
      inputs: actionUserInputs,
      execute: props.actionHandler,
    });
    setIsLoading(false);
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
    return (
      !isLoading &&
      Object.values(userInputs)
        .map((userInput) => userInput.isValid)
        .every((isValid) => isValid)
    );
  }, [actionDictionary, props.smartLinkIdWithActionId, isLoading]);

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
          onClick={executePreAction}
          disabled={props.preAction.disabled || isLoading}
        >
          {isLoading ? (
            <LoadingAnimation
              type="spinner"
              classNames={{
                spinner: 'notifi-smartlink-action-btn-loading-spinner',
              }}
            />
          ) : null}
          <div
            className={clsx(
              'notifi-smartlink-action-btn-text',
              isLoading && 'hidden',
            )}
          >
            {props.preAction.label}
          </div>
        </button>
      ) : (
        /* Main Action Button */
        <button
          className={clsx('btn', 'notifi-smartlink-action-btn')}
          onClick={executeAction}
          disabled={!isButtonEnabled}
        >
          {isLoading ? (
            <LoadingAnimation
              type="spinner"
              classNames={{
                spinner: 'notifi-smartlink-action-btn-loading-spinner',
              }}
            />
          ) : null}
          <div
            className={clsx(
              'notifi-smartlink-action-btn-text',
              isLoading && 'hidden',
            )}
          >
            {!smartLinkConfigDictionary[smartLinkId].isActive
              ? (props.copy?.inactiveLabel ?? 'Unavailable')
              : action.label}
          </div>
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

const getTextBoxDefaultValue = (actionInputParams: ActionInputParams) => {
  switch (actionInputParams.type) {
    case 'TEXTBOX':
      return actionInputParams.default;
    default:
      throw new Error(
        `NotifiSmartLink.getDefaultValue: Unknown action input type: ${JSON.stringify(actionInputParams.type)}`,
      );
  }
};
