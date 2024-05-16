import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useNotifiTargetListener } from '@/hooks/useNotifiTargetListener';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import {
  FtuStage,
  useNotifiTargetContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { DestinationPanel } from './DestinationPanel';

export type ConfigDestinationModalProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
};
export const ConfigDestinationModal: React.FC<ConfigDestinationModalProps> = ({
  contactInfo,
}) => {
  useNotifiTargetListener();
  const { isLoading: isLoadingTargets } = useNotifiTargetContext();
  const { isLoading: isLoadingTopics } = useNotifiTopicContext();
  const { updateFtuStage } = useNotifiUserSettingContext();

  return (
    <div className="w-full sm:min-h-[520px] sm:w-4/6 bg-notifi-card-bg rounded-2xl flex flex-col items-center justify-between mt-[1rem] mb-8 px-4">
      <div className="w-full">
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5 text-notifi-text-medium">
            STEP 2 of 3
          </p>
          <p className="font-medium text-lg sm:my-6 mt-2 mb-6 text-notifi-text">
            Verify your destinations
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          {isLoadingTargets || isLoadingTopics ? (
            <div>
              <LoadingSpinner />
            </div>
          ) : (
            <DestinationPanel contactInfo={contactInfo} />
          )}
        </div>
      </div>
      <button
        className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mt-9 sm:mt-0 mb-9 text-sm font-bold disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
        onClick={() => {
          updateFtuStage(FtuStage.Alerts);
        }}
      >
        <span>Next</span>
      </button>
    </div>
  );
};
