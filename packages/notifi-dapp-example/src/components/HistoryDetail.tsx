'use client';

import { Icon } from '@/assets/Icon';
import { parseNotificationHistory } from '@/utils/notifiHistoryUtils';
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

  const { timestamp, topic, message } = parseNotificationHistory(
    historyDetailEntry,
    'detail',
  );

  const sanitizedMessage = useMemo(
    () => DOMPurify.sanitize(message),
    [message],
  );

  return (
    <div className="p-6">
      <div className="hover:bg-notifi-back-button-hover-bg focus:bg-notifi-back-button-focus-bg h-6 w-6 rounded-2xl">
        <Icon
          className="cursor-pointer text-gray-500 mb-4"
          onClick={() => setHistoryDetailEntry(null)}
          id="left-arrow"
        />
      </div>
      <div className="px-9 flex">
        <div className="grow flex flex-col gap-3">
          <div>
            <div className="font-medium text-xl">{topic}</div>
            <div className="font-medium text-gray-500">{timestamp}</div>
          </div>

          <div
            className="font-medium text-base break-words max-w-[70vw] sm:max-w-[675px]"
            dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
          />
        </div>
      </div>
    </div>
  );
};
