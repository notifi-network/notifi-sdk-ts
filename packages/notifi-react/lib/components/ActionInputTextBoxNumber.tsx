import { ActionInputParamsTextBox as ActionInputTextBoxType } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import {
  type SmartLinkIdWithActionId,
  useNotifiSmartLinkContext,
} from '../context';

export type ActionInputTextBoxNumberProps = {
  input: ActionInputTextBoxType<'NUMBER'>;
  smartLinkIdWithActionId: SmartLinkIdWithActionId;
  userInputId: number;
  classNames?: {
    container?: string;
    constraintPrompt?: string;
    inputContainer?: string;
    input?: string;
  };
};

export const ActionInputTextBoxNumber: React.FC<
  ActionInputTextBoxNumberProps
> = (props: ActionInputTextBoxNumberProps) => {
  const { updateActionUserInputs, actionDictionary } =
    useNotifiSmartLinkContext();

  const value = React.useMemo(() => {
    return actionDictionary[props.smartLinkIdWithActionId].userInputs[
      props.userInputId
    ].userInput.value as number | '';
  }, [actionDictionary, props.smartLinkIdWithActionId, props.userInputId]);

  const validateAndUpdateActionInputs = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    let valueToSet: number | '' = Number(input.value);

    if (input.value === '') {
      valueToSet = '';
    } else if (
      props.input.constraintType?.min &&
      props.input.constraintType.min >= Number(input.value)
    ) {
      valueToSet = props.input.constraintType.min;
    } else if (
      props.input.constraintType?.max &&
      props.input.constraintType.max <= Number(input.value)
    ) {
      valueToSet = props.input.constraintType.max;
    }

    updateActionUserInputs(props.smartLinkIdWithActionId, {
      [props.userInputId]: {
        userInput: {
          type: 'TEXTBOX',
          value: valueToSet,
          id: props.input.id,
        },
        isValid: props.input.isRequired ? input.value !== '' : true,
      },
    });
  };

  return (
    <div
      className={clsx(
        'notifi-smartlink-action-input-textbox',
        props.classNames?.container,
      )}
    >
      {getConstraintPrompt(props.input.constraintType) ? (
        <div
          className={clsx(
            'notifi-smartlink-action-input-textbox-constraint-prompt',
            props.classNames?.constraintPrompt,
          )}
        >
          {getConstraintPrompt(props.input.constraintType)}
        </div>
      ) : null}
      <div
        className={clsx(
          'notifi-smartlink-action-input-textbox-container',
          props.classNames?.inputContainer,
        )}
      >
        {props.input.prefix ? (
          /* No class override, only support default className */
          <div className="notifi-smartlink-action-input-textbox-prefix">
            {props.input.prefix}
          </div>
        ) : null}
        <input
          type="number"
          placeholder={props.input.placeholder.toString()}
          min={props.input.constraintType?.min}
          max={props.input.constraintType?.max}
          step="0.0001"
          className={clsx(
            'clean-input',
            'notifi-smartlink-action-input-textbox-input',
            props.classNames?.input,
          )}
          value={value}
          required={props.input.isRequired}
          onChange={validateAndUpdateActionInputs}
        />
        {props.input.suffix ? (
          /* No class override, only support default className */
          <div className="notifi-smartlink-action-input-textbox-suffix">
            {props.input.suffix}
          </div>
        ) : null}
      </div>
    </div>
  );
};
// Utils

const getConstraintPrompt = (
  constraintType: ActionInputTextBoxType<'NUMBER'>['constraintType'],
): string | undefined => {
  if (!constraintType) return '';
  const { min, max } = constraintType;
  if (min && max) {
    return `Enter an amount between ${min} - ${max}`;
  } else if (min) {
    return `Enter an amount above ${min}`;
  } else if (max) {
    return `Enter an amount below ${max}`;
  }
};
