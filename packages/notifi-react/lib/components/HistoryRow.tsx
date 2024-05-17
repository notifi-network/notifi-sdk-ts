import { Types } from '@notifi-network/notifi-graphql';
import clsx from 'clsx';
import { format, isToday, isWithinInterval, subDays } from 'date-fns';
import React from 'react';

import { Icon } from '../assets/Icons';
import { historyItem, useNotifiTenantConfigContext } from '../context';
import { defaultCopy, getFusionEventMetadata } from '../utils';

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
  historyItem: historyItem;
};

export const HistoryRow: React.FC<HistoryRowProps> = (props) => {
  const icon = props.historyItem.icon as Types.GenericEventIconHint;

  const { fusionEventTopics } = useNotifiTenantConfigContext();

  const titleDisplay = React.useMemo(() => {
    const topicName = props.historyItem.topic;
    const topic = fusionEventTopics.find(
      (topic) => topic.uiConfig.name === topicName,
    );
    return topic
      ? getFusionEventMetadata(topic)?.uiConfigOverride?.historyDisplayName ??
          topicName
      : defaultCopy.historyRow.legacyTopic;
  }, [fusionEventTopics]);

  return (
    <div className={clsx('notifi-history-row', props.className?.container)}>
      <div
        className={clsx(
          'notifi-history-row-unread-indicator',
          !props.historyItem.read && 'unread',
          props.className?.unreadIndicator,
        )}
      ></div>
      <div className={clsx('notifi-history-row-icon', props.className?.icon)}>
        <Icon type={icon} />
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
            {titleDisplay}
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
  return format(
    new Date(timestamp),
    isToday(dateObject)
      ? 'hh:mm b'
      : isWithinInterval(dateObject, { start: sevenDaysAgo, end: now })
      ? 'eeee'
      : 'MM/dd',
  );
};
