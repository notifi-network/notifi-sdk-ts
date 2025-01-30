import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import { Icon } from '../assets/Icons';
import { InboxView } from './Inbox';

type Tab = 'config' | 'discover' | 'history';

export type InboxNavTabsProps = {
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
  inboxView: InboxView;
  classNames?: {
    container?: string;
  };
  isDiscoverViewEnabled?: boolean;
};

export const InboxNavTabs: React.FC<PropsWithChildren<InboxNavTabsProps>> = (
  props,
) => {
  const activeTab: Tab = React.useMemo(() => {
    switch (props.inboxView) {
      case InboxView.InboxConfigTopic:
      case InboxView.InboxConfigTargetList:
      case InboxView.InboxConfigTargetEdit:
        return 'config';
      case InboxView.InboxDiscover:
        return 'discover';
      case InboxView.InboxHistory:
        return 'history';
    }
  }, [props.inboxView]);

  return (
    <div
      data-cy="notifi-inbox-nav-tabs"
      className={clsx('notifi-inbox-nav-tabs', props.classNames?.container)}
    >
      <div onClick={() => props.setInboxView(InboxView.InboxHistory)}>
        <Icon type={activeTab === 'history' ? 'bell-fill' : 'bell'} />
      </div>
      {props.isDiscoverViewEnabled ? (
        <div onClick={() => props.setInboxView(InboxView.InboxDiscover)}>
          <Icon type={activeTab === 'discover' ? 'compass-fill' : 'compass'} />
        </div>
      ) : null}
      <div onClick={() => props.setInboxView(InboxView.InboxConfigTopic)}>
        <Icon type={activeTab === 'config' ? 'gear-fill' : 'gear'} />
      </div>
    </div>
  );
};
