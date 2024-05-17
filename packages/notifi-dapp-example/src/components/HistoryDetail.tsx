'use client';

import { Icon } from '@/assets/Icon';
import { formatTimestampInHistoryDetail } from '@/utils/notifiHistoryUtils';
import { HistoryItem } from '@notifi-network/notifi-react';
import DOMPurify from 'dompurify';
import { Dispatch, SetStateAction, useMemo } from 'react';

type HistoryDetailProps = {
  historyDetailEntry: HistoryItem | null;
  setHistoryDetailEntry: Dispatch<SetStateAction<HistoryItem | null>>;
};

export const HistoryDetail: React.FC<HistoryDetailProps> = ({
  setHistoryDetailEntry,
  historyDetailEntry,
}) => {
  if (!historyDetailEntry) return null;

  const { timestamp, topic, message } = historyDetailEntry;

  const replaceLinks = (html: string): string => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.getElementsByTagName('a');

    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      link.setAttribute('target', '_blank');
    }

    return doc.documentElement.innerHTML;
  };

  const sanitizedMessage = useMemo(
    () => DOMPurify.sanitize(message),
    [message],
  );

  return (
    <div className="p-6 h-full">
      <div className="hover:bg-notifi-card-border focus:bg-notifi-destination-card-bg h-6 w-6 rounded-2xl">
        <Icon
          className="cursor-pointer text-notifi-text mb-4"
          onClick={() => setHistoryDetailEntry(null)}
          id="left-arrow"
        />
      </div>
      <div className="px-9 flex mt-3 h-full">
        <div className="grow flex flex-col gap-6 overflow-y-scroll h-[90%]">
          <div>
            <div className="font-medium text-xl text-notifi-text">{topic}</div>
            <div className="font-medium text-notifi-text-light mt-1">
              {formatTimestampInHistoryDetail(timestamp)}
            </div>
          </div>

          <div
            className="font-medium text-base break-words max-w-[70vw] sm:max-w-[675px] text-notifi-text whitespace-pre-wrap history-link"
            dangerouslySetInnerHTML={{ __html: replaceLinks(sanitizedMessage) }}
          />
        </div>
      </div>
    </div>
  );
};
