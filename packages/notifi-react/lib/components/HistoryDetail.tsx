import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import DOMPurify from 'dompurify';
import React from 'react';

import { HistoryItem } from '../context';
import { defaultCopy } from '../utils';
import { NavHeader, NavHeaderProps, NavHeaderRightCta } from './NavHeader';

type HistoryDetailProps = {
  classNames?: {
    container?: string;
    main?: string;
    subject?: string;
    timestamp?: string;
    message?: string;
    NavHeader?: NavHeaderProps['classNames'];
  };
  copy?: {
    headerTitle?: string;
  };
  selectedHistoryItem: HistoryItem | null;
  setSelectedHistoryItem: React.Dispatch<
    React.SetStateAction<HistoryItem | null>
  >;
  isHidden: boolean;
  navHeaderRightCta?: NavHeaderRightCta;
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
      data-cy="notifi-history-detail"
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
        rightCta={props.navHeaderRightCta}
        classNames={
          props.classNames?.NavHeader ?? {
            container: 'notifi-inbox-history-detail-header',
          }
        }
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
          {historyItem.topic}
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
          dangerouslySetInnerHTML={{ __html: replaceLinks(sanitizedMessage) }}
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
