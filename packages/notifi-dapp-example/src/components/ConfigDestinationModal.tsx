import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useNotifiTargetListener } from '@/hooks/useNotifiTargetListener';
import {
  CardConfigItemV1,
  FtuStage,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import React from 'react';

import { DestinationPanel } from './DestinationPanel';

export type ConfigDestinationModalProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
};
export const ConfigDestinationModal: React.FC<ConfigDestinationModalProps> = ({
  contactInfo,
}) => {
  useNotifiTargetListener();
  const { updateFtuStage } = useNotifiSubscriptionContext();
  const { loading } = useNotifiSubscriptionContext();

  return (
    <div className="min-h-[500px] w-4/6 bg-notifi-container-bg rounded-2xl flex flex-col items-center justify-between mt-[1rem] mb-8">
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5">STEP 2 of 3</p>
          <p className="font-medium text-lg my-6">Verify your destinations</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          {loading ? (
            <div>
              <LoadingSpinner />
            </div>
          ) : (
            <DestinationPanel contactInfo={contactInfo} />
          )}
        </div>
      </div>
      <button
        className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-6 text-sm font-bold disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
        onClick={() => {
          updateFtuStage(FtuStage.Alerts);
        }}
      >
        <span>Next</span>
      </button>
    </div>
  );
};
