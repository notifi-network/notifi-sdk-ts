import clsx from 'clsx';
import React from 'react';

import { InboxConfigTargetEdit } from './InboxConfigTargetEdit';
import { InboxConfigTargetList } from './InboxConfigTargetList';
import { InboxConfigTopic } from './InboxConfigTopic';
import { InboxHistory } from './InboxHistory';
import { InboxNavTabs, InboxNavTabsProps } from './InboxNavTabs';

type InboxProps = {
  classNames?: {
    container?: string;
    footer?: string;
    inboxViews?: string;
    InboxNavTabs?: InboxNavTabsProps['classNames'];
  };
};

export enum InboxView {
  InboxHistory = 'inbox-history',
  InboxConfigTopic = 'inbox-config-topic',
  InboxConfigTargetList = 'inbox-config-target-list',
  InboxConfigTargetEdit = 'inbox-config-target-edit',
}

export const Inbox: React.FC<InboxProps> = (props) => {
  const [inboxView, setInboxView] = React.useState<InboxView>(
    InboxView.InboxHistory,
  );

  return (
    <div className={clsx('notifi-inbox', props.classNames?.container)}>
      <div className={clsx('notifi-inbox-views', props.classNames?.inboxViews)}>
        <InboxHistory isHidden={inboxView !== InboxView.InboxHistory} />
        {inboxView === InboxView.InboxConfigTopic ? (
          <InboxConfigTopic {...{ setInboxView }} />
        ) : null}
        {inboxView === InboxView.InboxConfigTargetList ? (
          <InboxConfigTargetList {...{ setInboxView }} />
        ) : null}
        {inboxView === InboxView.InboxConfigTargetEdit ? (
          <InboxConfigTargetEdit {...{ setInboxView }} />
        ) : null}
      </div>
      <div className={clsx('notifi-inbox-footer', props.classNames?.footer)}>
        <InboxNavTabs
          setInboxView={setInboxView}
          inboxView={inboxView}
          classNames={props.classNames?.InboxNavTabs}
        />
      </div>
    </div>
  );
};
