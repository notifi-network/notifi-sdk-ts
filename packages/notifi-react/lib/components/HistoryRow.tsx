import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import { format, isToday, isWithinInterval, subDays } from 'date-fns';
import React from 'react';

import { Icon } from '../assets/Icons';
import { HistoryItem, useNotifiHistoryContext } from '../context';
import { defaultCopy } from '../utils';

export type HistoryRowProps = {
  className?: {
    container?: string;
    unreadIndicator?: string;
    icon?: string;
    content?: string;
    title?: string;
    titleText?: string;
    timestamp?: string;
    subject?: string;
  };
  historyItem: HistoryItem;
  onClick?: () => void;
};

export const HistoryRow: React.FC<HistoryRowProps> = (props) => {
  const icon = props.historyItem.icon as Types.GenericEventIconHint;
  const { markAsRead } = useNotifiHistoryContext();

  console.log({ historyItem: props.historyItem });
  return (
    <div
      className={clsx(
        'notifi-history-row',
        props.className?.container,
        props.historyItem.read ? 'read' : '',
      )}
      onClick={() => {
        if (!props.historyItem.read) {
          markAsRead([props.historyItem.id]);
        }
        props.onClick?.();
      }}
    >
      <div
        className={clsx(
          'notifi-history-row-unread-indicator',
          props.historyItem.read && 'read',
          props.className?.unreadIndicator,
        )}
      ></div>
      <div className={clsx('notifi-history-row-icon', props.className?.icon)}>
        {props.historyItem.customIconUrl ? (
          <img
            src={props.historyItem.customIconUrl}
            className="notifi-history-row-custom-icon"
            alt="custom icon"
            style={{ width: 24, height: 24 }}
          />
        ) : (
          <Icon type={icon} />
        )}
        {/* <Icon type={icon} /> */}
      </div>
      <div
        className={clsx('notifi-history-row-content', props.className?.content)}
      >
        <div
          className={clsx('notifi-history-row-title', props.className?.title)}
        >
          <div
            className={clsx(
              'notifi-history-row-title-text',
              props.className?.titleText,
            )}
          >
            {props.historyItem.topic ?? defaultCopy.historyRow.legacyTopic}
          </div>
          <div
            className={clsx(
              'notifi-history-row-timestamp',
              props.className?.timestamp,
            )}
          >
            {formatTimestampInHistoryRow(props.historyItem.timestamp)}
          </div>
        </div>
        <div
          className={clsx(
            'notifi-history-row-subject',
            props.className?.subject,
          )}
        >
          {props.historyItem.subject}
        </div>
      </div>
    </div>
  );
};

// Utils
const formatTimestampInHistoryRow = (timestamp: string) => {
  const dateObject = new Date(timestamp);
  const now = new Date();
  const sevenDaysAgo = subDays(now, 7);
  // NOTE:
  // case#1 ('hh:mm b' format): time (e.g. 12:00 PM, 1:00 AM, etc.); 'b' could be AM/PM/noon/midnight;
  // case#2 ('eee' format): day of the week (e.g. Mon, Tue, Wed, etc.);
  // case#3 ('MMM d' format): month and day (e.g. Jan 1, Feb 2, etc.)
  return format(
    new Date(timestamp),
    isToday(dateObject)
      ? 'hh:mm b'
      : isWithinInterval(dateObject, { start: sevenDaysAgo, end: now })
        ? 'eee'
        : 'MMM d',
  )
    .replace('noon', 'PM')
    .replace('midnight', 'AM');
};
