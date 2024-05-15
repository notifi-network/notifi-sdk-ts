import clsx from 'clsx';
import React from 'react';

import { HistoryItem } from '../context';
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
  const [selectedHistoryItem, setSelectedHistoryItem] =
    React.useState<HistoryItem | null>(null);

  return (
    <div className={clsx('notifi-inbox', props.classNames?.container)}>
      <div className={clsx('notifi-inbox-views', props.classNames?.inboxViews)}>
        <InboxHistoryList
          {...{ setSelectedHistoryItem, setInboxView }}
          isHidden={inboxView !== InboxView.InboxHistoryList}
        />
        <InboxHistoryDetail
          {...{ selectedHistoryItem, setInboxView }}
          isHidden={inboxView !== InboxView.InboxHistoryDetail}
        />
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
