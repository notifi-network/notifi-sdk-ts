import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import {
  FtuStage,
  hasValidTargetMoreThan,
  useNotifiTargetContext,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { TargetList } from './TargetList';

export type FtuTargetListProps = {
  contactInfo: CardConfigItemV1['contactInfo'];
  onClickNext?: () => void;
};
export const FtuTargetList: React.FC<FtuTargetListProps> = ({
  contactInfo,
  onClickNext,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { isLoading: isLoadingTopics } = useNotifiTopicContext();
  const { updateFtuStage } = useNotifiUserSettingContext();
  const {
    targetDocument: { targetData },
  } = useNotifiTargetContext();
  const { cardConfig } = useNotifiTenantConfigContext();

  const isTargetListValid = cardConfig?.isContactInfoRequired
    ? hasValidTargetMoreThan(targetData, 0)
    : true;

  return (
    <div className="w-full sm:min-h-[520px] sm:w-4/6 bg-notifi-card-bg rounded-2xl flex flex-col items-center justify-between mt-[1rem] mb-8 px-4">
      <div className="w-full">
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5 text-notifi-text-medium">
            STEP 1 of 2
          </p>
          <p className="font-medium text-lg md:mt-6 mt-2 text-notifi-text">
            How do you want to be notified?
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-sm opacity-50 font-medium md:my-4 mt-2 mb-6 text-notifi-text-medium text-center">
            Select any of the following destinations to receive notifications
          </p>
          {isLoadingTopics ? (
            <div>
              <LoadingSpinner />
            </div>
          ) : (
            <TargetList contactInfo={contactInfo} parentComponent="ftu" />
          )}
        </div>
      </div>
      <button
        className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mt-9 sm:mt-0 mb-9 text-sm font-bold disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
        onClick={async () => {
          setIsLoading(true);
          try {
            await updateFtuStage(FtuStage.Alerts);
            onClickNext?.();
          } finally {
            setIsLoading(false);
          }
        }}
        disabled={isLoading || !isTargetListValid}
      >
        <span>Next</span>
      </button>
    </div>
  );
};
