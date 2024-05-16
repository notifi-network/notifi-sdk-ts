import clsx from 'clsx';
import React from 'react';

import { useNotifiHistoryContext } from '../context';

type InboxHistoryListProps = {
  classNames?: {
    container?: string;
  };
};

export const InboxHistoryList: React.FC<InboxHistoryListProps> = (props) => {
  const { historyItems, hasNextPage, getHistoryItems, unreadCount } =
    useNotifiHistoryContext();
  return (
    <div
      className={clsx('notifi-inbox-history-list', props.classNames?.container)}
    >
      <div>loaded items count: {JSON.stringify(historyItems.length)}</div>
      <div>unread count: {JSON.stringify(unreadCount)}</div>
      {historyItems.map((item, id) => (
        <div key={id}>
          {item.topic} {item.subject} {JSON.stringify(item.read)}
        </div>
      ))}
      {hasNextPage ? <div onClick={() => getHistoryItems()}>next</div> : null}
    </div>
  );
};
