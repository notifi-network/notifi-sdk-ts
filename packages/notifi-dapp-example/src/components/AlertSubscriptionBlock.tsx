import { LabelWithSubTopicsEventTypeItem } from '@/hooks/useNotifiTopics';

import { AlertSubscriptionRow } from './AlertSubscriptionRow';

type AlertSubscriptionRowProps = {
  labelWithSubTopics: LabelWithSubTopicsEventTypeItem;
};

export const AlertSubscriptionBlock: React.FC<AlertSubscriptionRowProps> = ({
  labelWithSubTopics,
}) => {
  return (
    <div className="w-72 rounded-lg bg-notifi-alert-subscription-block-bg/75 border border-gray-200 rounded-b-md relative">
      <div className=" bg-white text-center py-3 font-medium border border-b-gray-200 rounded-md text-lg">
        {labelWithSubTopics.name}
      </div>
      <div className="px-3 py-2 flex flex-col gap-1 md:max-h-[228px] overflow-scroll ">
        {labelWithSubTopics.subTopics.map((eventType) => {
          return (
            <div key={eventType.name}>
              <AlertSubscriptionRow eventType={eventType} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
