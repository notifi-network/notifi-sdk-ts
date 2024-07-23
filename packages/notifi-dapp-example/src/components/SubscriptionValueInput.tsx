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
  const [isTermSelectDropdownOpen, setIsTermSelectDropdownOpen] =
    React.useState(false);
  const [selectTerm, setSelectTerm] = React.useState<string>('All');
  const subscriptionValueOptions = resolveObjectArrayRef(
    'subscriptionValueOptions',
    subscriptionValueOrRef,
    inputs,
  );

  const getSubscriptionValueOrRef = () => {
    if (subscriptionValueOrRef.type === 'ref') {
      return subscriptionValueOrRef.ref;
    } else {
      return subscriptionValueOrRef.value;
    }
  };

  const filteredOptions = subscriptionValueOptions.filter((option) => {
    if (selectTerm === 'All') {
      return true;
    }
    return option.label.startsWith(selectTerm);
  });

  return (
    <div className="relative ml-14 w-[247px] h-12 bg-notifi-card-bg rounded-md mb-3 text-notifi-text p-3 border-0 focus:border-0 focus-visible:border-0 cursor-pointer">
      <Icon className="absolute right-0 bottom-0" id="dropdown-arrow" />
      <div
        className="rounded-md bg-notifi-card-bg text-start text-notifi-text"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        {props.subscriptionValue
          ? props.subscriptionValue.label
          : (
              <div className="text-notifi-text-light">
                {getSubscriptionValueOrRef() === 'pricePairs'
                  ? 'Select Pair'
                  : 'Select Market'}
              </div>
            ) ?? (
              <div className="text-notifi-text-light">
                {getSubscriptionValueOrRef() === 'pricePairs'
                  ? 'Select Pair'
                  : 'Select Market'}
              </div>
            )}
      </div>
      {isDropdownOpen && (
        <div>
          {getSubscriptionValueOrRef() === 'pricePairs' ? null : (
            <div className="absolute top-12 left-0 w-[247px] h-10 bg-notifi-card-bg mb-3 text-notifi-text p-3 border-0 focus:border-0 focus-visible:border-0 cursor-pointer z-50 mt-1 text-sm">
              <Icon
                className="absolute left-16 top-[21px]"
                id="dropdown-arrow"
              />
              <div
                className="rounded-md bg-notifi-card-bg text-start text-notifi-tenant-brand-bg font-medium"
                onClick={(e) => {
                  setIsTermSelectDropdownOpen((prev) => !prev);
                  e.stopPropagation();
                }}
              >
                {selectTerm}
              </div>
              {isTermSelectDropdownOpen && (
                <div>
                  <div className="absolute top-8 left-0 w-[90px] bg-notifi-dropdown-bg rounded-md shadow-lg z-10 max-h-[90px] mt-1 ml-1 p-1 text-sm font-medium">
                    <div
                      className="h-7 flex rounded-md items-center justify-start text-middle text-notifi-tenant-brand-bg font-normal hover:bg-notifi-card-bg cursor-pointer pl-3"
                      onClick={() => {
                        setSelectTerm('All');
                        setIsTermSelectDropdownOpen(false);
                      }}
                    >
                      All
                    </div>
                    <div
                      className="h-7 flex items-center rounded-md justify-start text-middle text-notifi-text font-normal hover:bg-notifi-card-bg cursor-pointer pl-3"
                      onClick={() => {
                        setSelectTerm('LONG');
                        setIsTermSelectDropdownOpen(false);
                      }}
                    >
                      LONG
                    </div>
                    <div
                      className="h-7 flex items-center rounded-md justify-start text-middle text-notifi-text font-normal hover:bg-notifi-card-bg cursor-pointer pl-3"
                      onClick={() => {
                        setSelectTerm('SHORT');
                        setIsTermSelectDropdownOpen(false);
                      }}
                    >
                      SHORT
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div
            className={`absolute left-0 w-[247px] ${
              getSubscriptionValueOrRef() === 'pricePairs'
                ? 'top-12 rounded-lg'
                : 'top-[86px] rounded-b-lg'
            } bg-notifi-card-bg shadow-lg z-10 max-h-[140px] overflow-y-auto mt-1`}
          >
            {filteredOptions.map((option) => (
              <div
                className="h-10 flex items-center justify-start text-middle text-notifi-text font-normal hover:text-white cursor-pointer border-b border-notifi-card-border pl-3"
                onClick={() => {
                  props.setSubscriptionValue(option);
                  setIsDropdownOpen(false);
                }}
                key={option.label}
              >
                {getSubscriptionValueOrRef() === 'pricePairs' ? (
                  option.label
                ) : (
                  <>
                    <div className="text-sm text-notifi-text-medium w-14">
                      {splitOptionLabel(option.label).firstWord}
                    </div>
                    <div>{splitOptionLabel(option.label).restOfString}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// util
const splitOptionLabel = (label: string) => {
  const [firstWord, ...rest] = label.split(' ');
  return {
    firstWord,
    restOfString: rest.join(' '),
  };
};
