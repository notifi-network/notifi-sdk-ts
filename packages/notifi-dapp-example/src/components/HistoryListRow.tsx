import { Icon } from '@/assets/Icon';
import { useNotifiHistory } from '@/hooks/useNotifiHistory';
import {
  ParsedNotificationHistory,
  parseNotificationHistory,
} from '@/utils/notificationHistory';
import { Types } from '@notifi-network/notifi-graphql';
import { Dispatch, SetStateAction, useState } from 'react';

type HistoryListRowProps = {
  historyDetailEntry: Types.FusionNotificationHistoryEntryFragmentFragment | null;
  setHistoryDetailEntry: Dispatch<
    SetStateAction<Types.FusionNotificationHistoryEntryFragmentFragment | null>
  >;
  setUnreadCount: Dispatch<SetStateAction<number | null>>;
};

// TODO: Rename and move to utils
type IconStyles = {
  [key in Types.GenericEventIconHint]: {
    iconColor: string;
    iconBackground: string;
  };
};
// TODO: Rename and move to utils
const iconStyles: IconStyles = {
  // TODO: style TBD
  CHART: {
    iconColor: 'text-notifi-label-chart',
    iconBackground: 'bg-notifi-chart',
  },
  CHECKMARK: {
    iconColor: 'text-notifi-label-checkmark',
    iconBackground: 'bg-notifi-checkmark',
  },
  CLOCK: {
    iconColor: 'text-notifi-label-clock',
    iconBackground: 'bg-notifi-clock',
  },
  DAO: {
    iconColor: 'text-blue-500',
    iconBackground: 'bg-blue-100',
  },
  DOWN_ARROW: {
    iconColor: 'text-notifi-label-down-arrow',
    iconBackground: 'bg-notifi-down-arrow',
  },
  FLAG: {
    iconColor: 'text-notifi-label-flag',
    iconBackground: 'bg-notifi-flag',
  },
  GRAPH: {
    iconColor: 'text-notifi-label-graph',
    iconBackground: 'bg-notifi-graph',
  },
  INFO: {
    iconColor: 'text-notifi-label-info',
    iconBackground: 'bg-notifi-info',
  },
  MEGAPHONE: {
    iconColor: 'text-notifi-label-megaphone',
    iconBackground: 'bg-notifi-megaphone',
  },
  PERCENT: {
    iconColor: 'text-notifi-label-percent',
    iconBackground: 'bg-notifi-percent',
  },
  STAR: {
    iconColor: 'text-white',
    iconBackground: 'bg-radial-gradient-orange',
  },
  SWAP: {
    iconColor: 'text-notifi-label-swap',
    iconBackground: 'bg-notifi-success',
  },
  UP_ARROW: {
    iconColor: 'text-notifi-label-up-arrow',
    iconBackground: 'bg-notifi-up-arrow',
  },
  URGENT: {
    iconColor: 'text-notifi-label-urgent',
    iconBackground: 'bg-notifi-urgent',
  },
  WATCH: {
    iconColor: 'text-notifi-label-watch',
    iconBackground: 'bg-notifi-watch',
  },
};

export const HistoryListRow: React.FC<HistoryListRowProps> = ({
  historyDetailEntry,
  setHistoryDetailEntry,
  setUnreadCount,
}) => {
  const [parsedNotificationHistory, setParsedNotificationHistory] =
    useState<ParsedNotificationHistory | null>(
      historyDetailEntry ? parseNotificationHistory(historyDetailEntry) : null,
    );

  const { markNotifiHistoryAsRead } = useNotifiHistory();

  const clickHistoryRow = () => {
    if (!historyDetailEntry?.id) return;
    setHistoryDetailEntry(historyDetailEntry);
    if (parsedNotificationHistory?.read) return;
    markNotifiHistoryAsRead([historyDetailEntry.id]);
    setUnreadCount((prev) => (prev ? prev - 1 : prev));
    setParsedNotificationHistory((existing) => {
      if (existing) {
        return { ...existing, read: true };
      }
      return null;
    });
  };

  if (
    !parsedNotificationHistory ||
    parsedNotificationHistory.topic === 'Unsupported Notification Type'
  ) {
    return null;
  }

  const icon = parsedNotificationHistory.icon as Types.GenericEventIconHint;

  return (
    <div
      className={`
      p-6 line-clamp-1 flex relative border-b border-gray-200 cursor-pointer`}
      onClick={clickHistoryRow}
    >
      <div
        className={`${
          !parsedNotificationHistory.read ? '' : 'hidden'
        } size-3 bg-blue-200 rounded-3xl flex justify-center items-center absolute top-3 left-3`}
      >
        <div className="bg-blue-600 size-1 rounded-3xl"></div>
      </div>
      <div
        className={`h-6 w-6 rounded-md ${iconStyles[icon].iconBackground} mr-3 my-auto`}
      >
        <Icon className={`mr-1 ${iconStyles[icon].iconColor}`} id={icon} />
      </div>

      <div className="grow">
        <div>{parsedNotificationHistory.topic}</div>
        <div className="text-gray-500 text-xs">
          {parsedNotificationHistory.subject}
        </div>
      </div>

      <div className="text-xs opacity-70">
        {parsedNotificationHistory.timestamp}
      </div>
    </div>
  );
};
