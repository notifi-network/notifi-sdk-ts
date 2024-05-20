import { Icon } from '@/assets/Icon';
import { formatTimestampInHistoryRow } from '@/utils/notifiHistoryUtils';
import { getFusionEventMetadata } from '@/utils/topic';
import { Types } from '@notifi-network/notifi-graphql';
import {
  HistoryItem,
  useNotifiHistoryContext,
  useNotifiTenantConfigContext,
} from '@notifi-network/notifi-react';
import { useMemo } from 'react';

type HistoryListRowProps = {
  historyDetailEntry: HistoryItem;
  onClick?: () => void;
};

export const HistoryListRow: React.FC<HistoryListRowProps> = ({
  historyDetailEntry,
  onClick,
}) => {
  const { fusionEventTopics } = useNotifiTenantConfigContext();
  const { markAsRead } = useNotifiHistoryContext();

  const titleDisplay = useMemo(() => {
    const topicName = historyDetailEntry.topic;
    const topic = fusionEventTopics.find(
      (topic) => topic.uiConfig.name === topicName,
    );
    return topic
      ? getFusionEventMetadata(topic)?.uiConfigOverride?.historyDisplayName ??
          topicName
      : topicName;
  }, [fusionEventTopics]);

  const clickHistoryRow = () => {
    if (!historyDetailEntry?.id) return;
    if (!historyDetailEntry.read) {
      markAsRead([historyDetailEntry.id]);
    }
    onClick?.();
  };

  return (
    <div
      className={`mx-2 md:mx-6 my-2 p-3 line-clamp-1 flex justify-between relative cursor-pointer bg-notifi-destination-card-bg rounded-lg ${
        !historyDetailEntry.read ? 'bg-notifi-destination-logo-card-bg' : ''
      }  hover:border hover:border-notifi-input-border`}
      onClick={clickHistoryRow}
    >
      <div
        className={`${
          !historyDetailEntry.read ? '' : 'bg-transparent'
        } h-full w-1 bg-notifi-tenant-brand-bg rounded-3xl flex justify-center items-center absolute top-0 left-0 z-1`}
      ></div>

      <div className="flex flex-row">
        <div className="flex flex-row items-center w-15">
          {historyDetailEntry.customIconUrl.length > 0 ? (
            <>
              <img
                src={historyDetailEntry.customIconUrl}
                className="w-10 h-10 ml-1 mr-3"
              />
            </>
          ) : (
            <div className={`h-10 w-10 mr-3 ml-1`}>
              <Icon
                className="m-2"
                id={historyDetailEntry.icon as Types.GenericEventIconHint}
              />
            </div>
          )}
        </div>

        <div className="grow text-sm md:max-w-full max-w-[75%]">
          <div
            className={`${
              !historyDetailEntry.read ? 'font-semibold' : ''
            } text-notifi-text`}
          >
            {titleDisplay.length > 0 ? titleDisplay : historyDetailEntry.topic}
          </div>
          <div className="text-gray-500 text-sm text-notifi-text-medium">
            {historyDetailEntry.subject}
          </div>
        </div>
      </div>

      <div className="text-xs opacity-70 text-notifi-text-light">
        {formatTimestampInHistoryRow(historyDetailEntry.timestamp)}
      </div>
    </div>
  );
};
