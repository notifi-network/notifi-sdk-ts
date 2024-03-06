import {
  FtuStage,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React from 'react';

import { AlertSubscription } from './AlertSubscription';

export const ConfigAlertModal = () => {
  const { updateFtuStage } = useNotifiSubscriptionContext();

  return (
    <div className="w-4/6 bg-notifi-container-bg rounded-2xl flex flex-col items-center justify-between mb-8">
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5">STEP 3 OF 3</p>
          <p className="font-medium text-lg mt-6">
            Select alerts you want to receive
          </p>
        </div>
      </div>

      <div className="flex-grow min-h-0 overflow-scroll my-6">
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
