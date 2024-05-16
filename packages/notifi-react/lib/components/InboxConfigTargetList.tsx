import clsx from 'clsx';
import React from 'react';

export type InboxConfigTargetListProps = {
  classNames?: {
    container?: string;
  };
};

export const InboxConfigTargetList: React.FC<InboxConfigTargetListProps> = (
  props,
) => {
  return (
    <div
      className={clsx(
        'notifi-inbox-config-target-list',
        props.classNames?.container,
      )}
    >
      Dummy Inbox Config Target List
    </div>
  );
};
