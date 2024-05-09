import {
  InputObject,
  ValueOrRef,
  resolveObjectArrayRef,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTenantConfigContext } from '../context';
import { defaultCopy } from '../utils';

type SubscriptionValueInputProps = {
  setSubscriptionValue: React.Dispatch<InputObject>;
  subscriptionValueRef: ValueOrRef<InputObject[]>;
  subscriptionValue: InputObject | null;
  className?: {
    container?: string;
    dropdownContainer?: string;
    dropdownValue?: string;
    dropdownList?: string;
  };
  copy?: {
    dropdownPlaceholder?: string;
  };
};

export const SubscriptionValueInput: React.FC<SubscriptionValueInputProps> = (
  props,
) => {
  const { inputs } = useNotifiTenantConfigContext();
  const subscriptionValueOrRef = props.subscriptionValueRef;
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const subscriptionValueOptions = resolveObjectArrayRef(
    'subscriptionValueOptions',
    subscriptionValueOrRef,
    inputs,
  );
  return (
    <div
      className={clsx('subscription-value-input', props.className?.container)}
    >
      {/** Dropdown (TODO: consider to create a new component) */}
      {subscriptionValueOptions.length > 0 ? (
        <div
          className={clsx(
            'subscription-value-input-dropdown',
            props.className?.dropdownContainer,
          )}
        >
          <div
            className={clsx(
              'subscription-value-input-dropdown-value',
              props.className?.dropdownValue,
            )}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
          >
            {props.subscriptionValue
              ? props.subscriptionValue.label
              : props.copy?.dropdownPlaceholder ??
                defaultCopy.subscriptionValueInput.dropdownPlaceholder}
          </div>
          {isDropdownOpen && (
            <div
              className={clsx(
                'subscription-value-input-dropdown-list',
                props.className?.dropdownList,
              )}
            >
              {subscriptionValueOptions.map((option) => (
                <div
                  onClick={() => {
                    props.setSubscriptionValue(option);
                    setIsDropdownOpen(false);
                  }}
                  key={option.label}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
      {/** Text field (TODO: consider to create a new component) TODO#2: Style CSS */}
      {subscriptionValueOptions.length === 0 ? (
        <div>
          <input
            type="text"
            value={props.subscriptionValue?.value}
            onChange={(e) =>
              props.setSubscriptionValue({
                value: e.target.value,
                label: '',
              })
            }
          />
        </div>
      ) : null}
    </div>
  );
};
