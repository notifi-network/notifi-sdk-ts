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
  userInputId: number; // TODO: for exec action
  classNames?: {
    container?: string;
    input?: string;
  };
};

export const ActionInputTextBoxNumber: React.FC<
  ActionInputTextBoxNumberProps
> = (props: ActionInputTextBoxNumberProps) => {
  const [value, setValue] = React.useState<number>();
  const { updateActionUserInputs } = useNotifiSmartLinkContext();

  React.useEffect(() => {
    /* Reset input field when being unmounted */
    return () => {
      updateActionUserInputs(props.smartLinkIdWithActionId, {
        [props.userInputId]: {
          userInput: {
            type: 'TEXTBOX',
            value: '',
            id: props.input.id,
          },
          isValid: false,
        },
      });
    };
  }, []);

  const validateAndUpdateActionInputs = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const input = e.target;
    if (input.value === '') return;

    let valueToSet = Number(input.value);
    if (
      props.input.constraintType?.min &&
      props.input.constraintType.min >= Number(input.value)
    ) {
      valueToSet = props.input.constraintType.min;
    }
    if (
      props.input.constraintType?.max &&
      props.input.constraintType.max <= Number(input.value)
    ) {
      valueToSet = props.input.constraintType.max;
    }

    setValue(valueToSet);
    updateActionUserInputs(props.smartLinkIdWithActionId, {
      [props.userInputId]: {
        userInput: {
          type: 'TEXTBOX',
          value: valueToSet,
          id: props.input.id,
        },
        isValid: true,
      },
    });
  };

  return (
    <div
      className={clsx(
        'notifi-smartlink-action-input-textbox-container',
        props.classNames?.container,
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
        className={clsx(
          'clean-input',
          'notifi-smartlink-action-input-textbox',
          props.classNames?.input,
        )}
        value={value ?? ''}
        required={props.input.isRequired}
        onChange={(e) => setValue(Number(e.target.value))}
        onBlur={validateAndUpdateActionInputs}
      />
      {props.input.suffix ? (
        /* No class override, only support default className */
        <div className="notifi-smartlink-action-input-textbox-suffix">
          {props.input.suffix}
        </div>
      ) : null}
    </div>
  );
};
