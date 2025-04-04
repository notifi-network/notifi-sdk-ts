import { SmartLinkActionUserInput } from '@notifi-network/notifi-dataplane';
import {
  SmartLinkAction as Action,
  ActionInput,
  ActionInputTextBox,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

export type SmartLinkActionProps = {
  action: Action;
  classNames?: {
    container?: string;
    textInputContainer?: string;
    checkboxContainer?: string;
  };
};

export const SmartLinkAction: React.FC<SmartLinkActionProps> = (props) => {
  // TODO: impl useCallback
  const executeAction = async () => {
    // TODO: implement action execution logic
  };

  return (
    <div
      className={clsx('notifi-samrtlink-action', props.classNames?.container)}
    >
      {props.action.inputs.map((input, id) => {
        // TODO: Extract to SmartLinkActionUserInput component
        if (input.type === 'TEXTBOX') {
          return (
            <div
              key={id}
              className={clsx(
                'notifi-smartlink-action-text-input-container',
                props.classNames?.textInputContainer,
              )}
            >
              <input
                type={input.inputType.toLowerCase()}
                placeholder={input.placeholder.toString()}
              />
            </div>
          );
        }
        if (input.type === 'CHECKBOX') {
          return (
            <div
              key={id}
              className={clsx(
                'notifi-smartlink-action-checkbox-container',
                props.classNames?.checkboxContainer,
              )}
            >
              <input type="checkbox" /> <span>{input.title}</span>
            </div>
          );
        }

        return null;
      })}
      <button onClick={executeAction}>{props.action.label}</button>
    </div>
  );
};
