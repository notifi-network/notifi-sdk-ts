import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import { Icon } from '../assets/Icons';
import { InboxView } from './Inbox';

export type InboxNavTabsProps = {
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
  inboxView: InboxView;
  classNames?: {
    container?: string;
  };
};

export const InboxNavTabs: React.FC<PropsWithChildren<InboxNavTabsProps>> = (
  props,
) => {
  const bellActive =
    props.inboxView === InboxView.InboxHistoryList ||
    props.inboxView === InboxView.InboxHistoryDetail;
  const configActive =
    props.inboxView === InboxView.InboxConfigTopic ||
    props.inboxView === InboxView.InboxConfigTargetList ||
    props.inboxView === InboxView.InboxConfigTargetEdit;
  return (
    <div className={clsx('notifi-inbox-nav-tabs', props.classNames?.container)}>
      <div onClick={() => props.setInboxView(InboxView.InboxHistoryList)}>
        <Icon type={bellActive ? 'bell-fill' : 'bell'} />
      </div>
      <div onClick={() => props.setInboxView(InboxView.InboxConfigTopic)}>
        <Icon type={configActive ? 'gear-fill' : 'gear'} />
      </div>
    </div>
  );
};
