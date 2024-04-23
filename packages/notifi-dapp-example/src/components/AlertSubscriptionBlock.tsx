import { Icon } from '@/assets/Icon';
import { LabelWithSubTopicsEventTypeItem } from '@/context/NotifiTopicContext';
import { iconStyles } from '@/utils/notifiHistoryUtils';

import { AlertSubscriptionRow } from './AlertSubscriptionRow';

type AlertSubscriptionRowProps = {
  labelWithSubTopics: LabelWithSubTopicsEventTypeItem;
};

export const AlertSubscriptionBlock: React.FC<AlertSubscriptionRowProps> = ({
  labelWithSubTopics,
}) => {
  return (
    <div className="w-72 rounded-b-md relative">
      <div className="text-center py-3 font-medium rounded-md text-lg flex flex-row items-center justify-start">
        <div
          className={`h-10 w-10 rounded-[12px] ${
            iconStyles[labelWithSubTopics.icon ?? 'INFO']?.iconBackground ?? ''
          } mx-5 my-auto border border-gray-200/50`}
        >
          <Icon
            className={`m-2 ${
              iconStyles[labelWithSubTopics.icon ?? 'INFO']?.iconColor ?? ''
            }`}
            id={labelWithSubTopics.icon ?? 'INFO'}
          />
        </div>
        {labelWithSubTopics.name}
      </div>
      <div className="px-3 py-2 flex flex-col gap-1">
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
