'use client';

import { Icon } from '@/assets/Icon';
import { parseNotificationHistory } from '@/utils/notificationHistory';
import { Types } from '@notifi-network/notifi-graphql';
import DOMPurify from 'dompurify';
import { Dispatch, SetStateAction, useMemo } from 'react';

type HistoryDetailProps = {
  historyDetailEntry: Types.FusionNotificationHistoryEntryFragmentFragment | null;
  setHistoryDetailEntry: Dispatch<
    SetStateAction<Types.FusionNotificationHistoryEntryFragmentFragment | null>
  >;
};
export const HistoryDetail: React.FC<HistoryDetailProps> = ({
  setHistoryDetailEntry,
  historyDetailEntry,
}) => {
  if (!historyDetailEntry) return null;

  const { timestamp, topic, message } =
    parseNotificationHistory(historyDetailEntry);

  const sanitizedMessage = useMemo(
    () => DOMPurify.sanitize(message),
    [message],
  );

  return (
    <div className="p-6">
      <Icon
        className="cursor-pointer"
        onClick={() => setHistoryDetailEntry(null)}
        id="left-arrow"
      />
      <div className="px-9 flex">
        <div className="grow flex flex-col gap-3">
          <div className="font-bold text-xl">{topic}</div>
          <div
            className="font-medium text-base"
            dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
          />
        </div>
        <div className="font-semibold opacity-70">{timestamp}</div>
      </div>
    </div>
  );
};
