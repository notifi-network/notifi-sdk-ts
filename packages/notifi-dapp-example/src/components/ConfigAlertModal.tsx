import {
  FtuStage,
  categorizeTopics,
  useNotifiTenantConfigContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { TopicBlock } from './TopicBlock';
import { TopicList } from './TopicList';

type ConfigAlertModalProps = {
  inFTU?: boolean;
};

export const ConfigAlertModal: React.FC<ConfigAlertModalProps> = ({
  inFTU = false,
}) => {
  const { updateFtuStage } = useNotifiUserSettingContext();
  const { cardConfig } = useNotifiTenantConfigContext();
  const { fusionEventTopics } = useNotifiTenantConfigContext();

  if (!cardConfig) {
    return null;
  }
  const { categorizedTopics, uncategorizedTopics } = categorizeTopics(
    cardConfig.eventTypes,
  );

  return (
    <div
      className={`${
        inFTU ? '' : 'md:min-h-[90vh]'
      } w-full h-full bg-notifi-card-bg rounded-2xl flex flex-col items-center justify-between mt-[1rem] mb-[2rem]`}
    >
      <div>
        {inFTU ? (
          <div className="flex flex-col items-center justify-center">
            <p className="font-semibold text-xs opacity-50 mt-2.5 text-notifi-text-medium">
              STEP 3 OF 3
            </p>
            <p className="font-medium text-lg sm:mt-6 mt-2 text-notifi-text">
              Select alerts you want to receive
            </p>
          </div>
        ) : (
          <p className="font-medium text-lg sm:mt-6 mt-2 text-notifi-text">
            Manage the alerts you want to receive
          </p>
        )}
      </div>

      <div className="flex-grow min-h-0 mt-6 flex flex-col md:flex-row flex-wrap lg:gap-[70px] justify-center md:mx-10">
        {uncategorizedTopics.subTopics.length > 0 ? (
          <TopicList inFTU={true} />
        ) : null}

        {categorizedTopics.map((labelWithSubTopics, id) => {
          return (
            <div key={id}>
              {labelWithSubTopics.subTopics.length > 0 ? (
                <TopicBlock
                  key={labelWithSubTopics.name}
                  labelWithSubTopics={labelWithSubTopics}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {inFTU ? (
        <button
          className="rounded-3xl bg-notifi-button-primary-bg text-notifi-button-primary-text w-72 h-11 mb-9 text-sm font-bold disabled:hover:bg-notifi-button-primary-bg hover:bg-notifi-button-primary-bg"
          onClick={() => {
            updateFtuStage(FtuStage.Done);
          }}
        >
          <span>Next</span>
        </button>
      ) : null}
    </div>
  );
};
