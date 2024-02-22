import {
  CardConfigItemV1,
  FtuStage,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React from 'react';

import { UserDestinationsInfoPanel } from './UserDestinationsInfoPanel';

export type ConfigDestinationModalProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
};
export const ConfigDestinationModal: React.FC<ConfigDestinationModalProps> = ({
  contactInfo,
}) => {
  const { updateFtuStage } = useNotifiSubscriptionContext();

  return (
    <div className="h-4/6 w-4/6 bg-notifi-container-bg rounded-2xl flex flex-col items-center justify-between mb-8 shadow-container">
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-bold text-xs opacity-50 mt-2.5">Step 2 of 3</p>
          <p className="font-bold text-2xl mt-6">
            How do you want to be notified?
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          {' '}
          <p className="text-sm opacity-50 font-semibold my-4">
            Select a minimum of one destination
          </p>
          <UserDestinationsInfoPanel contactInfo={contactInfo} />
        </div>
      </div>
      <button
        className="rounded bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-6 text-sm font-bold"
        onClick={() => {
          updateFtuStage(FtuStage.Alerts);
        }}
      >
        <span>Next</span>
      </button>
    </div>
  );
};