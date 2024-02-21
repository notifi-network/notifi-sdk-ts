import { Icon, SpriteIconId } from '@/assets/Icon';
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
    iconColor: 'text-orange-500',
    iconBackground: 'bg-gradient-to-tl from-orange-300/50 to-orange-100/50',
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
}) => {
  const [parsedNotificationHistory, setParsedNotificationHistory] =
    useState<ParsedNotificationHistory | null>(
      historyDetailEntry ? parseNotificationHistory(historyDetailEntry) : null,
    );

  const { markNotifiHistoryAsRead } = useNotifiHistory();

  const clickHistoryRow = () => {
    if (!historyDetailEntry?.id) return;
    markNotifiHistoryAsRead([historyDetailEntry.id]);
    setParsedNotificationHistory((existing) => {
      if (existing) {
        return { ...existing, read: true };
      }
      return null;
    });
    setHistoryDetailEntry(historyDetailEntry);
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
      className={`${
        !parsedNotificationHistory.read
          ? 'border-l-4 border-notifi-label-connect-wallet-text'
          : 'bg-slate-300  bg-opacity-20'
      } flex w-4/5 m-auto px-4 py-3 bg-white shadow-xl rounded-r-lg mb-2 cursor-pointer box-content`}
      onClick={clickHistoryRow}
    >
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
