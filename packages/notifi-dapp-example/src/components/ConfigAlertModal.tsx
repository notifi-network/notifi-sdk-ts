import {
  FtuStage,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React from 'react';

import { AlertSubscription } from './AlertSubscription';

export const ConfigAlertModal = () => {
  const { updateFtuStage } = useNotifiSubscriptionContext();

  return (
    <div className="h-4/6 w-4/6 bg-notifi-container-bg rounded-2xl flex flex-col items-center justify-between mb-8 shadow-container">
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5">Step 3 of 3</p>
          <p className="text-2xl mt-6">How do you want to be notified?</p>
        </div>
      </div>

      <div className="flex-grow min-h-0 overflow-scroll">
        <AlertSubscription title="" />
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
