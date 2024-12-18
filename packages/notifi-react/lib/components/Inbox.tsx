import clsx from 'clsx';
import React from 'react';

import {
  InboxConfigTargetList,
  InboxConfigTargetListProps,
} from './InboxConfigTargetList';
import { InboxConfigTopic, InboxConfigTopicProps } from './InboxConfigTopic';
import { InboxHistory, InboxHistoryProps } from './InboxHistory';
import { InboxNavTabs, InboxNavTabsProps } from './InboxNavTabs';
import { NavHeaderRightCta } from './NavHeader';

export type InboxProps = {
  classNames?: {
    container?: string;
    footer?: string;
    inboxViews?: string;
    InboxNavTabs?: InboxNavTabsProps['classNames'];
    InboxConfigTargetList?: InboxConfigTargetListProps['classNames'];
    InboxConfigTopic?: InboxConfigTopicProps['classNames'];
    InboxHistory?: InboxHistoryProps['classNames'];
  };
  copy?: {
    InboxConfigTargetList?: InboxConfigTargetListProps['copy'];
    InboxConfigTopic?: InboxConfigTopicProps['copy'];
  };
  navHeaderRightCta?: NavHeaderRightCta;
};

export enum InboxView {
  InboxHistory = 'inbox-history',
  InboxConfigTopic = 'inbox-config-topic',
  InboxConfigTargetList = 'inbox-config-target-list',
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
        {inboxView === InboxView.InboxConfigTargetList ? (
          <InboxConfigTargetList
            {...{ setInboxView }}
            classNames={props.classNames?.InboxConfigTargetList}
            copy={props.copy?.InboxConfigTargetList}
            navHeaderRightCta={props.navHeaderRightCta}
          />
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
