'use client';

import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { categorizeTopics } from '@/hooks/useNotifiTopics';

import { AlertSubscriptionBlock } from './AlertSubscriptionBlock';

export type AlertSubscriptionRowProps = {
  title?: string;
};

export const AlertSubscription: React.FC<AlertSubscriptionRowProps> = ({
  title,
}) => {
  const { cardConfig } = useNotifiCardContext();
  const { categorizedTopics, uncategorizedTopics } = categorizeTopics(
    cardConfig.eventTypes,
  );

  return (
    <div className="flex flex-col items-center 2xl:px-[15.75rem] xl:px-[10rem]">
      <div className="mt-4 mb-6 font-medium text-lg">
        {title ?? 'Manage the alerts you want to receive'}
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
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
