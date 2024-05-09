import {
  FtuStage,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { AlertSubscription } from './AlertSubscription';

export const ConfigAlertModal = () => {
  const { updateFtuStage } = useNotifiUserSettingContext();

  return (
    <div className="w-full h-screen sm:w-4/6 bg-notifi-card-bg rounded-2xl flex flex-col items-center justify-between mt-[1rem] mb-[2rem]">
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5 text-notifi-text-medium">
            STEP 3 OF 3
          </p>
          <p className="font-medium text-lg sm:mt-6 mt-2 text-notifi-text">
            Select alerts you want to receive
          </p>
        </div>
      </div>

      <div className="flex-grow min-h-0 my-6">
        <AlertSubscription />
      </div>

      <button
        className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-6 text-sm font-bold disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
        onClick={() => {
          updateFtuStage(FtuStage.Done);
        }}
      >
        <span>Next</span>
      </button>
    </div>
  );
};
