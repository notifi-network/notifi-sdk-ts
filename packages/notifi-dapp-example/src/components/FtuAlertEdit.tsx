import { Icon } from '@/assets/Icon';
import {
  FtuStage,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { TopicList } from './TopicList';

type FtuAlertEditProps = {
  onClickBack?: () => void;
};

export const FtuAlertEdit: React.FC<FtuAlertEditProps> = ({ onClickBack }) => {
  const { updateFtuStage } = useNotifiUserSettingContext();

  return (
    <div className="w-full h-full sm:w-4/6 bg-notifi-card-bg rounded-2xl flex flex-col items-center justify-between mt-[1rem] mb-[2rem] relative">
      <div
        onClick={onClickBack}
        className="text-notifi-text-medium absolute cursor-pointer flex items-center hover:bg-notifi-card-border focus:bg-notifi-destination-card-bg h-6 w-6 rounded-2xl top-6 left-6"
      >
        <Icon id="left-arrow" />
      </div>
      <div>
        <div className="flex flex-col items-center justify-center">
          <p className="font-semibold text-xs opacity-50 mt-2.5 text-notifi-text-medium">
            STEP 2 OF 2
          </p>
          <p className="font-medium text-lg sm:mt-6 mt-2 text-notifi-text">
            Select alerts you want to receive
          </p>
        </div>
      </div>

      <div className="flex-grow min-h-0 mt-6">
        <TopicList inFTU={true} />
      </div>

      <button
        className="rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text w-72 h-11 mb-9 text-sm font-bold disabled:hover:bg-notifi-button-primary-blueish-bg hover:bg-notifi-button-hover-bg"
        onClick={() => {
          updateFtuStage(FtuStage.Done);
        }}
      >
        <span>Next</span>
      </button>
    </div>
  );
};
