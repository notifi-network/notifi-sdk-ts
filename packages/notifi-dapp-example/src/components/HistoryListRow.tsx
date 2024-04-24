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
      historyDetailEntry
        ? parseNotificationHistory(historyDetailEntry, 'list')
        : null,
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
      className={`mx-6 my-2 p-3 line-clamp-1 flex relative cursor-pointer bg-notifi-destination-card-bg rounded-lg ${
        !parsedNotificationHistory.read
          ? 'bg-notifi-destination-logo-card-bg'
          : ''
      }  hover:border hover:border-notifi-input-border`}
      onClick={clickHistoryRow}
    >
      <div
        className={`${
          !parsedNotificationHistory.read ? '' : 'hidden'
        } h-18 w-1 bg-notifi-tenant-brand-bg rounded-3xl flex justify-center items-center absolute top-0 left-0 z-1`}
      ></div>
      <div className={`h-10 w-10 rounded-[12px] mr-3 ml-1`}>
        <Icon
          className={`m-2 ${iconStyles[icon]?.iconColor ?? ''}`}
          id={icon}
        />
      </div>

      <div className="grow text-sm">
        <div
          className={`${
            !parsedNotificationHistory.read ? 'font-semibold' : ''
          } text-notifi-text`}
        >
          {parsedNotificationHistory.topic}
        </div>
        <div className="text-gray-500 text-sm text-notifi-text-medium">
          {parsedNotificationHistory.subject}
        </div>
      </div>

      <div className="text-xs opacity-70 text-notifi-text-light">
        {parsedNotificationHistory.timestamp}
      </div>
    </div>
  );
};
