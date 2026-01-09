import {
  InputObject,
  ValueOrRef,
  resolveObjectArrayRef,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
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
    dropdownValueContent?: string;
    dropdownIcon?: string;
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
  // const subscriptionValueOptions = resolveObjectArrayRef(
  //   'subscriptionValueOptions',
  //   subscriptionValueOrRef,
  //   inputs,
  // );

  const subscriptionValueOptions = React.useMemo(() => {
    try {
      return resolveObjectArrayRef(
        'subscriptionValueOptions',
        subscriptionValueOrRef,
        inputs,
      );
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [subscriptionValueOrRef, inputs]);

  return (
    <div
      className={clsx('subscription-value-input', props.className?.container)}
    >
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
            <div
              className={clsx(
                'subscription-value-input-dropdown-value-content',
                props.className?.dropdownValueContent,
                !props.subscriptionValue ? 'unselected' : '',
              )}
            >
              {props.subscriptionValue
                ? props.subscriptionValue.label
                : (props.copy?.dropdownPlaceholder ??
                  defaultCopy.subscriptionValueInput.dropdownPlaceholder)}
            </div>

            <div
              className={clsx(
                'subscription-value-input-dropdown-icon',
                props.className?.dropdownIcon,
              )}
            >
              <Icon type="triangle-down" />
            </div>
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
      {subscriptionValueOptions.length === 0 ? (
        <div style={{ color: 'red' }}>
          ERROR: No subscription value options available
        </div>
      ) : null}
    </div>
  );
};
