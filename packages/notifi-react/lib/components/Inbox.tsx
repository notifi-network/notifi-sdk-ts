import clsx from 'clsx';
import React from 'react';

import {
  InboxConfigTargetEdit,
  InboxConfigTargetEditProps,
} from './InboxConfigTargetEdit';
import {
  InboxConfigTargetList,
  InboxConfigTargetListProps,
} from './InboxConfigTargetList';
import { InboxConfigTopic, InboxConfigTopicProps } from './InboxConfigTopic';
import { InboxDiscover, InboxDiscoverProps } from './InboxDiscover';
import { InboxHistory, InboxHistoryProps } from './InboxHistory';
import { InboxNavTabs, InboxNavTabsProps } from './InboxNavTabs';
import { NavHeaderRightCta } from './NavHeader';

export type InboxProps = {
  classNames?: {
    container?: string;
    footer?: string;
    inboxViews?: string;
    InboxNavTabs?: InboxNavTabsProps['classNames'];
    InboxConfigTargetEdit?: InboxConfigTargetEditProps['classNames'];
    InboxConfigTargetList?: InboxConfigTargetListProps['classNames'];
    InboxConfigTopic?: InboxConfigTopicProps['classNames'];
    InboxHistory?: InboxHistoryProps['classNames'];
  };
  copy?: {
    InboxConfigTargetEdit?: InboxConfigTargetEditProps['copy'];
    InboxConfigTargetList?: InboxConfigTargetListProps['copy'];
    InboxConfigTopic?: InboxConfigTopicProps['copy'];
    InboxDiscover?: InboxDiscoverProps['copy'];
  };
  navHeaderRightCta?: NavHeaderRightCta;
  isDiscoverViewEnabled?: boolean;
};

export enum InboxView {
  InboxHistory = 'inbox-history',
  InboxConfigTopic = 'inbox-config-topic',
  InboxConfigTargetList = 'inbox-config-target-list',
  InboxConfigTargetEdit = 'inbox-config-target-edit',
  InboxDiscover = 'inbox-discover',
}

export const Inbox: React.FC<InboxProps> = (props) => {
  const [inboxView, setInboxView] = React.useState<InboxView>(
    InboxView.InboxHistory,
  );

  return (
    <div className={clsx('notifi-inbox', props.classNames?.container)}>
      <div className={clsx('notifi-inbox-views', props.classNames?.inboxViews)}>
        <InboxHistory
          isHidden={inboxView !== InboxView.InboxHistory}
          classNames={props.classNames?.InboxHistory}
          setInboxView={setInboxView}
          navHeaderRightCta={props.navHeaderRightCta}
        />
        {inboxView === InboxView.InboxConfigTopic ? (
          <InboxConfigTopic
            {...{ setInboxView }}
            classNames={props.classNames?.InboxConfigTopic}
            copy={props.copy?.InboxConfigTopic}
            navHeaderRightCta={props.navHeaderRightCta}
          />
        ) : null}
        {inboxView === InboxView.InboxDiscover ? (
          <InboxDiscover
            inboxView={inboxView}
            copy={props.copy?.InboxDiscover}
          />
        ) : null}
        {inboxView === InboxView.InboxConfigTargetList ? (
          <InboxConfigTargetList
            {...{ setInboxView }}
            classNames={props.classNames?.InboxConfigTargetList}
            copy={props.copy?.InboxConfigTargetList}
            navHeaderRightCta={props.navHeaderRightCta}
          />
        ) : null}
        {inboxView === InboxView.InboxConfigTargetEdit ? (
          <InboxConfigTargetEdit
            {...{ setInboxView }}
            classNames={props.classNames?.InboxConfigTargetEdit}
            copy={props.copy?.InboxConfigTargetEdit}
            navHeaderRightCta={props.navHeaderRightCta}
          />
        ) : null}
      </div>
      <div className={clsx('notifi-inbox-footer', props.classNames?.footer)}>
        <InboxNavTabs
          setInboxView={setInboxView}
          inboxView={inboxView}
          classNames={props.classNames?.InboxNavTabs}
          isDiscoverViewEnabled={props.isDiscoverViewEnabled}
        />
      </div>
    </div>
  );
};
