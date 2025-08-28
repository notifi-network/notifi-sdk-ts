import { Icon } from '@/assets/Icon';
import { Types } from '@notifi-network/notifi-graphql';
import {
  HistoryItem,
  useNotifiHistoryContext,
} from '@notifi-network/notifi-react';
import { format, isToday, isWithinInterval, subDays } from 'date-fns';

type HistoryListRowProps = {
  historyDetailEntry: HistoryItem;
  onClick?: () => void;
};

export const HistoryListRow: React.FC<HistoryListRowProps> = ({
  historyDetailEntry,
  onClick,
}) => {
  const { markAsRead } = useNotifiHistoryContext();

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
            {historyDetailEntry.topic.length > 0
              ? historyDetailEntry.topic
              : ''}
          </div>
          <div className="text-gray-500 text-sm text-notifi-text-medium">
            {historyDetailEntry.subject}
          </div>
        </div>
      </div>

      <div className="text-xs opacity-70 text-notifi-text-light min-w-14">
        {formatTimestampInHistoryRow(historyDetailEntry.timestamp)}
      </div>
    </div>
  );
};
// Utils

export const formatTimestampInHistoryRow = (timestamp: string) => {
  const dateObject = new Date(timestamp);
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  return format(
    new Date(timestamp),
    isToday(timestamp)
      ? 'h:mm b'
      : isWithinInterval(dateObject, { start: sevenDaysAgo, end: now })
        ? 'eeee'
        : dateObject.getFullYear() <= now.getFullYear() - 1
          ? 'MMM d yyyy'
          : 'MMM d',
  );
};
