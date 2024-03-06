import { Icon } from '@/assets/Icon';
import { useNotifiHistory } from '@/hooks/useNotifiHistory';
import {
  ParsedNotificationHistory,
  iconStyles,
  parseNotificationHistory,
} from '@/utils/notifiHistoryUtils';
import { Types } from '@notifi-network/notifi-graphql';
import { Dispatch, SetStateAction, useState } from 'react';

type HistoryListRowProps = {
  historyDetailEntry: Types.FusionNotificationHistoryEntryFragmentFragment | null;
  setHistoryDetailEntry: Dispatch<
    SetStateAction<Types.FusionNotificationHistoryEntryFragmentFragment | null>
  >;
  setUnreadCount: Dispatch<SetStateAction<number | null>>;
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
      className={`p-6 line-clamp-1 flex relative border-b border-gray-200 cursor-pointer ${
        !parsedNotificationHistory.read ? '' : 'bg-gray-50'
      } hover:notifi-shadow-card hover:bg-gray-100`}
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
        className={`h-10 w-10 rounded-[12px] ${
          iconStyles[icon]?.iconBackground ?? ''
        } mr-3 ml-1 my-auto border border-gray-200/50`}
      >
        <Icon
          className={`m-2 ${iconStyles[icon]?.iconColor ?? ''}`}
          id={icon}
        />
      </div>

      <div className="grow text-sm">
        <div
          className={`${
            !parsedNotificationHistory.read ? 'font-semibold' : ''
          }`}
        >
          {parsedNotificationHistory.topic}
        </div>
        <div className="text-gray-500 text-sm">
          {parsedNotificationHistory.subject}
        </div>
      </div>

      <div className="text-xs opacity-70">
        {parsedNotificationHistory.timestamp}
      </div>
    </div>
  );
};
