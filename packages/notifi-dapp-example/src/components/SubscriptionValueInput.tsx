import { Icon } from '@/assets/Icon';
import React from 'react';

export const SubscriptionValueInput = () => {
  // TODO: use real data from API
  const dummyList = [
    'ETH / USDC - Chain',
    'ETH / USD - Chain',
    'ETH / LINK - Chain',
    'ETH / 1- Chain',
    'ETH / 2 - Chain',
    'ETH / 3 - Chain',
    'ETH / 4 - Chain',
  ];

  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [subscriptionValue, setSubscriptionValue] = React.useState('');

  return (
    <div className="relative ml-14 w-60 h-12 bg-notifi-card-bg rounded-md mb-3 text-notifi-text p-3 border-0 focus:border-0 focus-visible:border-0 cursor-pointer">
      <Icon className="absolute right-0 bottom-0" id="dropdown-arrow" />
      <div
        className="rounded-md bg-notifi-card-bg text-start"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        {subscriptionValue ? subscriptionValue : 'select' ?? 'select'}
      </div>
      {isDropdownOpen && (
        <div className="absolute top-12 left-0 w-60 bg-notifi-card-bg rounded-lg shadow-lg z-10 max-h-[180px] overflow-y-auto border border-notifi-card-border">
          {dummyList.map((option) => (
            <div
              className="h-10 flex items-center justify-start text-middle text-notifi-text-light hover:text-white cursor-pointer border-b border-notifi-card-border pl-3"
              onClick={() => {
                setSubscriptionValue(option);
                // TODO: uncomment this line when use real data
                // props.setSubscriptionValue(option);
                setIsDropdownOpen(false);
              }}
              key={option}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
