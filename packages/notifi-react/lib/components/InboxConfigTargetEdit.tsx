import clsx from 'clsx';
import React from 'react';

export type InboxConfigTargetEditProps = {
  classNames?: {
    container?: string;
  };
};

export const InboxConfigTargetEdit: React.FC<InboxConfigTargetEditProps> = (
  props,
) => {
  return (
    <div
      className={clsx(
        'notifi-inbox-config-target-edit',
        props.classNames?.container,
      )}
    >
      Dummy Inbox Config Target Edit
    </div>
  );
};
