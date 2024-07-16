import clsx from 'clsx';
import React from 'react';

import { HistoryItem } from '../context';
import { HistoryDetail } from './HistoryDetail';
import { HistoryList } from './HistoryList';
import { InboxView } from './Inbox';

export type InboxHistoryProps = {
  isHidden: boolean;
  classNames?: {
    container?: string;
  };
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
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
        setInboxView={props.setInboxView}
      />
      <HistoryDetail
        {...{ selectedHistoryItem, setSelectedHistoryItem }}
        isHidden={!selectedHistoryItem}
      />
    </div>
  );
};
