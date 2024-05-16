import clsx from 'clsx';
import React from 'react';

import { InboxConfigTargetEdit } from './InboxConfigTargetEdit';
import { InboxConfigTopic } from './InboxConfigTopic';
import { InboxHistoryDetail } from './InboxHistoryDetail';
import { InboxHistoryList } from './InboxHistoryList';
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
  InboxHistoryList = 'inbox-history-list',
  InboxHistoryDetail = 'inbox-history-detail',
  InboxConfigTopic = 'inbox-config-topic',
  InboxConfigTargetList = 'inbox-config-target-list',
  InboxConfigTargetEdit = 'inbox-config-target-edit',
}

export const Inbox: React.FC<InboxProps> = (props) => {
  const [inboxView, setInboxView] = React.useState<InboxView>(
    InboxView.InboxHistoryList,
  );
  return (
    <div className={clsx('notifi-inbox', props.classNames?.container)}>
      <div className={clsx('notifi-inbox-views', props.classNames?.inboxViews)}>
        {inboxView === InboxView.InboxHistoryList ? <InboxHistoryList /> : null}
        {inboxView === InboxView.InboxHistoryDetail ? (
          <InboxHistoryDetail />
        ) : null}
        {inboxView === InboxView.InboxConfigTopic ? <InboxConfigTopic /> : null}
        {inboxView === InboxView.InboxConfigTargetList ? (
          <InboxConfigTargetEdit />
        ) : null}
        {inboxView === InboxView.InboxHistoryDetail ? (
          <InboxConfigTargetEdit />
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
