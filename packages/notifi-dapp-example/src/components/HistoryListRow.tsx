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

  return (
    <div
      className={`${
        !parsedNotificationHistory.read
          ? 'border-l-4 border-notifi-label-connect-wallet-text'
          : 'bg-slate-300  bg-opacity-20'
      } flex w-4/5 m-auto px-4 py-3 bg-white shadow-xl rounded-r-lg mb-2 cursor-pointer`}
      onClick={clickHistoryRow}
    >
      <Icon
        className="mr-1 text-notifi-label-connect-wallet-text"
        id={parsedNotificationHistory.icon as SpriteIconId}
      />
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
