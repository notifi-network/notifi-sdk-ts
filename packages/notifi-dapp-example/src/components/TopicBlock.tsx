import { Icon } from '@/assets/Icon';
// import { iconStyles } from '@/utils/notifiHistoryUtils';
import {
  LabelWithSubTopicsEventTypeItem,
  getFusionEventTopicsBySubTopics,
  useNotifiTenantConfigContext,
} from '@notifi-network/notifi-react';

import { TopicList } from './TopicList';

type AlertSubscriptionRowProps = {
  labelWithSubTopics: LabelWithSubTopicsEventTypeItem;
};

export const TopicBlock: React.FC<AlertSubscriptionRowProps> = ({
  labelWithSubTopics,
}) => {
  const { fusionEventTopics } = useNotifiTenantConfigContext();
  const fusionEventTopicsBySubTopics = getFusionEventTopicsBySubTopics(
    fusionEventTopics,
    labelWithSubTopics.subTopics,
  );
  console.log('icon', labelWithSubTopics.icon);

  return (
    <div className="w-72 rounded-b-md relative flex flex-col justify-center items-start">
      <div className="text-center py-3 font-semibold rounded-md text-lg flex flex-row items-center justify-start">
        <img
          src={labelWithSubTopics.iconUrl ?? ''}
          className="w-7 h-7 mr-3 ml-1"
        />
        {labelWithSubTopics.name}
      </div>
      <div className="py-2">
        <TopicList
          inFTU={true}
          categorizedTopics={fusionEventTopicsBySubTopics}
        />
      </div>
    </div>
  );
};
