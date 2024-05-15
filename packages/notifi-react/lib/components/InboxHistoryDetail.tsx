import clsx from 'clsx';
import { format, isToday, parseISO } from 'date-fns';
import DOMPurify from 'dompurify';
import React from 'react';

import { HistoryItem } from '../context';
import { defaultCopy } from '../utils';
import { InboxView } from './Inbox';
import { NavHeader } from './NavHeader';

type InboxHistoryDetailProps = {
  classNames?: {
    container?: string;
    main?: string;
  };
  copy?: {
    headerTitle?: string;
  };
  selectedHistoryItem: HistoryItem | null;
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
  isHidden: boolean;
};

export const InboxHistoryDetail: React.FC<InboxHistoryDetailProps> = (
  props,
) => {
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
        'notifi-inbox-history-detail',
        props.isHidden && 'hidden',
        props.classNames?.container,
      )}
    >
      <NavHeader
        leftCta={{
          icon: 'arrow-back',
          action: () => props.setInboxView(InboxView.InboxHistoryList),
        }}
      >
        {props.copy?.headerTitle ?? defaultCopy.inboxHistoryDetail.headerTitle}
      </NavHeader>
      <div
        className={clsx(
          'notifi-inbox-history-detail-main',
          props.classNames?.main,
        )}
      >
        <div>{historyItem.subject}</div>
        <div>{formatTimestampInHistoryDetail(historyItem.timestamp)}</div>
        <div dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
      </div>
    </div>
  );
};

// Utils
const formatTimestampInHistoryDetail = (date: string): string => {
  try {
    const parsedDate = parseISO(date);

    const month = parsedDate.toLocaleString('default', { month: 'short' });
    const clockTime = format(parsedDate, 'HH:mm b');
    const dateTime = format(parsedDate, 'dd');
    const finalDate = `${month} ${dateTime}`;
    const day = format(parsedDate, 'E');

    if (isToday(parsedDate)) {
      return clockTime;
    }
    return day + ', ' + finalDate + ', ' + clockTime;
  } catch {
    return '-';
  }
};
