import { Icon } from '@/assets/Icon';
import {
  InputObject,
  ValueOrRef,
  resolveObjectArrayRef,
} from '@notifi-network/notifi-frontend-client';
import { useNotifiTenantConfigContext } from '@notifi-network/notifi-react';
import React from 'react';

type SubscriptionValueInputProps = {
  setSubscriptionValue: React.Dispatch<InputObject>;
  subscriptionValueRef: ValueOrRef<InputObject[]>;
  subscriptionValue: InputObject | null;
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
    <div className="relative ml-14 w-60 h-12 bg-notifi-card-bg rounded-md mb-3 text-notifi-text p-3 border-0 focus:border-0 focus-visible:border-0 cursor-pointer">
      <Icon className="absolute right-0 bottom-0" id="dropdown-arrow" />
      <div
        className="rounded-md bg-notifi-card-bg text-start text-notifi-text-light"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        {props.subscriptionValue
          ? props.subscriptionValue.label
          : 'Select Pair' ?? 'Select Pair'}
      </div>
      {isDropdownOpen && (
        <div className="absolute top-12 left-0 w-60 bg-notifi-card-bg rounded-lg shadow-lg z-10 max-h-[180px] overflow-y-auto border border-notifi-card-border">
          {subscriptionValueOptions.map((option) => (
            <div
              className="h-10 flex items-center justify-start text-middle text-notifi-text-light hover:text-white cursor-pointer border-b border-notifi-card-border pl-3"
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
  );
};