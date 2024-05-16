import clsx from 'clsx';
import React from 'react';

type InboxHistoryDetailProps = {
  classNames?: {
    container?: string;
  };
};

export const InboxHistoryDetail: React.FC<InboxHistoryDetailProps> = (
  props,
) => {
  return (
    <div
      className={clsx(
        'notifi-inbox-history-detail',
        props.classNames?.container,
      )}
    >
      Dummy Inbox History Detail
    </div>
  );
};
