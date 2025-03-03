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
  const bellActive = props.inboxView === InboxView.InboxHistory;
  const configActive =
    props.inboxView === InboxView.InboxConfigTopic ||
    props.inboxView === InboxView.InboxConfigTargetList;
  return (
    <div
      data-cy="notifi-inbox-nav-tabs"
      className={clsx('notifi-inbox-nav-tabs', props.classNames?.container)}
    >
      <div onClick={() => props.setInboxView(InboxView.InboxHistory)}>
        <Icon type={bellActive ? 'bell-fill' : 'bell'} />
      </div>
      <div onClick={() => props.setInboxView(InboxView.InboxConfigTopic)}>
        <Icon type={configActive ? 'gear-fill' : 'gear'} />
      </div>
    </div>
  );
};
