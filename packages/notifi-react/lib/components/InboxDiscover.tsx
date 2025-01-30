import clsx from 'clsx';
import React from 'react';

import { defaultCopy } from '../utils';
import { InboxView } from './Inbox';
import { LoadingAnimation } from './LoadingAnimation';

export type InboxDiscoverProps = {
  inboxView: InboxView;
  classNames?: {
    container?: string;
    iframe?: string;
  };
  copy?: {
    src?: string;
  };
};

export const InboxDiscover: React.FC<InboxDiscoverProps> = (props) => {
  const [isDiscoverViewLoading, setIsDiscoverViewLoading] =
    React.useState(true);

  React.useEffect(() => {
    if (props.inboxView !== InboxView.InboxDiscover) {
      setIsDiscoverViewLoading(true);
    }
  }, [props.inboxView]);
  return (
    <div className={clsx('notifi-inbox-discover', props.classNames?.container)}>
      <iframe
        className={clsx(
          'notifi-inbox-discover-iframe',
          props.classNames?.iframe,
          isDiscoverViewLoading ? 'isLoading' : '',
        )}
        src={props.copy?.src ?? defaultCopy.inboxDiscover.src}
        onLoad={() => setIsDiscoverViewLoading(false)}
      />
      {isDiscoverViewLoading ? <LoadingAnimation type="spinner" /> : null}
    </div>
  );
};
