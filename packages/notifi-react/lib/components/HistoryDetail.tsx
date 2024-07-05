import clsx from 'clsx';
import { format, isToday, parseISO } from 'date-fns';
import DOMPurify from 'dompurify';
import React from 'react';

import { HistoryItem } from '../context';
import { defaultCopy } from '../utils';
import { NavHeader } from './NavHeader';

type HistoryDetailProps = {
  classNames?: {
    container?: string;
    main?: string;
    subject?: string;
    timestamp?: string;
    message?: string;
  };
  copy?: {
    headerTitle?: string;
  };
  selectedHistoryItem: HistoryItem | null;
  setSelectedHistoryItem: React.Dispatch<
    React.SetStateAction<HistoryItem | null>
  >;
  isHidden: boolean;
};

export const HistoryDetail: React.FC<HistoryDetailProps> = (props) => {
  const historyItem = props.selectedHistoryItem;
  if (!historyItem) {
    return null;
  }
  const sanitizedMessage = React.useMemo(
    () => DOMPurify.sanitize(historyItem.message),
    [historyItem.message],
  );
  return (
    <div
      className={clsx(
        'notifi-history-detail',
        props.isHidden && 'hidden',
        props.classNames?.container,
      )}
    >
      <NavHeader
        leftCta={{
          icon: 'arrow-back',
          action: () => props.setSelectedHistoryItem(null),
        }}
      >
        {props.copy?.headerTitle ?? defaultCopy.inboxHistoryDetail.headerTitle}
      </NavHeader>
      <div
        className={clsx('notifi-history-detail-main', props.classNames?.main)}
      >
        <div
          className={clsx(
            'notifi-history-detail-subject',
            props.classNames?.subject,
          )}
        >
          {historyItem.subject}
        </div>
        <div
          className={clsx(
            'notifi-history-detail-timestamp',
            props.classNames?.timestamp,
          )}
        >
          {formatTimestampInHistoryDetail(historyItem.timestamp)}
        </div>
        <div
          className={clsx(
            'notifi-history-detail-message',
            props.classNames?.message,
          )}
          dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
        />
      </div>
    </div>
  );
};

// Utils
const formatTimestampInHistoryDetail = (date: string): string => {
  try {
    return format(parseISO(date), 'PPPp');
  } catch {
    return '-';
  }
};
