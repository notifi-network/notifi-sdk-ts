import { Icon } from '@/assets/Icon';
import React from 'react';

export const VerifyBanner = () => {
  return (
    <>
      <div className="flex flex-row justify-between items-center h-12 bg-white mt-6 rounded-xl mr-10">
        <div className="flex flex-row items-center ml-3 text-sm font-semibold">
          <Icon
            id="check"
            className="text-notifi-button-primary-blueish-bg mr-3"
          />
          <div>Verify your email and Telegram ID and Discord</div>
        </div>
        <button className="mr-3 w-18 h-8 bg-notifi-button-primary-blueish-bg rounded-md text-sm font-bold text-white">
          Verify
        </button>
      </div>
    </>
  );
};
