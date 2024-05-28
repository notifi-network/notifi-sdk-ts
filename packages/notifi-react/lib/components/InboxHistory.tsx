import clsx from 'clsx';
import React from 'react';

import { HistoryItem } from '../context';
import { HistoryDetail } from './HistoryDetail';
import { HistoryList } from './HistoryList';

export type InboxHistoryProps = {
  isHidden: boolean;
  classNames?: {
    container?: string;
  };
};

export const InboxHistory: React.FC<InboxHistoryProps> = (props) => {
  const [selectedHistoryItem, setSelectedHistoryItem] =
    React.useState<HistoryItem | null>(null);
  return (
    <div
      className={clsx(
        'notifi-inbox-history',
        props.isHidden && 'hidden',
        props.classNames?.container,
      )}
    >
      <HistoryList
        {...{ setSelectedHistoryItem }}
        isHidden={!!selectedHistoryItem}
      />
      <HistoryDetail
        {...{ selectedHistoryItem, setSelectedHistoryItem }}
        isHidden={!selectedHistoryItem}
      />
    </div>
  );
};
