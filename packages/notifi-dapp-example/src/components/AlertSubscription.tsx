'use client';

import {
  categorizeTopics,
  useNotifiTenantConfigContext,
} from '@notifi-network/notifi-react';

import { AlertSubscriptionBlock } from './AlertSubscriptionBlock';
import { AlertSubscriptionRow } from './AlertSubscriptionRow';

export type AlertSubscriptionRowProps = {
  title?: string;
  inFTU?: boolean;
};

export const AlertSubscription: React.FC<AlertSubscriptionRowProps> = ({
  title,
  inFTU = false,
}) => {
  const { cardConfig, fusionEventTopics } = useNotifiTenantConfigContext();
  if (!cardConfig) return null;
  console.log('fusionEventTopics', fusionEventTopics);
  const { categorizedTopics } = categorizeTopics(cardConfig.eventTypes);

  return (
    <div
      className={`flex flex-col items-center 2xl:px-[15.75rem] xl:px-[10rem] ${
        inFTU ? '' : 'md:min-h-[94vh]'
      } grow h-full`}
    >
      {title ? (
        <div className="mt-8 mb-6 font-regular text-lg text-notifi-text">
          {title}
        </div>
      ) : null}
      <div className="flex flex-col gap-4 justify-center w-86 mb-6">
        {fusionEventTopics.map((topic) => (
          <AlertSubscriptionRow topic={topic} key={topic.uiConfig.name} />
        ))}
      </div>
      <div className="flex flex-wrap gap-4 justify-center w-72 md:w-[37rem]">
        {/* {uncategorizedTopics.subTopics.length > 0 ? (
          <AlertSubscriptionBlock labelWithSubTopics={uncategorizedTopics} />
        ) : null} */}

        {categorizedTopics.map((labelWithSubTopics, id) => {
          return (
            <div key={id}>
              {labelWithSubTopics.subTopics.length > 0 ? (
                <AlertSubscriptionBlock
                  key={labelWithSubTopics.name}
                  labelWithSubTopics={labelWithSubTopics}
                />
              ) : null}
            </div>
          );
        })}
        {/* NOTE: below are invisible placeholder to make the layout consistent */}
        <div className="w-72 rounded-lg invisible h-0"></div>
        <div className="w-72 rounded-lg invisible h-0"></div>
      </div>
    </div>
  );
};
