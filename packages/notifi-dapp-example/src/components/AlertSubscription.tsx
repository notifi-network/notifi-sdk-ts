'use client';

import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import { categorizeTopics } from '@/context/NotifiTopicContext';

import { AlertSubscriptionBlock } from './AlertSubscriptionBlock';

export type AlertSubscriptionRowProps = {
  title?: string;
};

export const AlertSubscription: React.FC<AlertSubscriptionRowProps> = ({
  title,
}) => {
  const { cardConfig } = useNotifiTenantConfig();
  const { categorizedTopics, uncategorizedTopics } = categorizeTopics(
    cardConfig.eventTypes,
  );

  return (
    <div className="flex flex-col items-center 2xl:px-[15.75rem] xl:px-[10rem] md:min-h-0 grow h-full">
      {title ? (
        <div className="mt-8 mb-6 font-medium text-lg text-notifi-text">
          {title}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-4 justify-center w-72 md:w-[37rem]">
        {uncategorizedTopics.subTopics.length > 0 ? (
          <AlertSubscriptionBlock labelWithSubTopics={uncategorizedTopics} />
        ) : null}

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
