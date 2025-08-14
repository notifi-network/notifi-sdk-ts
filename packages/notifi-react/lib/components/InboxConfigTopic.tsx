import clsx from 'clsx';
import React from 'react';

import { defaultCopy } from '../utils';
import { InboxView } from './Inbox';
import { NavHeader, NavHeaderProps, NavHeaderRightCta } from './NavHeader';
import { TargetStateBanner, TargetStateBannerProps } from './TargetStateBanner';
import { TopicList } from './TopicList';

export type InboxConfigTopicProps = {
  classNames?: {
    container?: string;
    main?: string;
    TargetStateBanner?: TargetStateBannerProps['classNames'];
    banner?: string;
    title?: string;
    NavHeader?: NavHeaderProps['classNames'];
  };
  copy?: {
    header?: string;
    title?: string;
  };
  setInboxView: React.Dispatch<React.SetStateAction<InboxView>>;
  navHeaderRightCta?: NavHeaderRightCta;
};

export const InboxConfigTopic: React.FC<InboxConfigTopicProps> = (props) => {
  return (
    <div
      className={clsx('notifi-inbox-config-topic', props.classNames?.container)}
    >
      <NavHeader
        rightCta={props.navHeaderRightCta}
        classNames={
          props.classNames?.NavHeader ?? {
            container: 'notifi-inbox-config-topic-header',
          }
        }
      >
        {props.copy?.header ?? defaultCopy.inboxConfigTopic.header}
      </NavHeader>
      <div
        className={clsx(
          'notifi-inbox-config-topic-main',
          props.classNames?.main,
        )}
      >
        <div
          className={clsx(
            'notifi-inbox-config-topic-banner',
            props.classNames?.banner,
          )}
        >
          <TargetStateBanner
            classNames={props.classNames?.TargetStateBanner}
            onClickCta={() => {
              props.setInboxView(InboxView.InboxConfigTargetList);
            }}
          />
        </div>

        <div
          className={clsx(
            'notifi-inbox-config-topic-title',
            props.classNames?.title,
          )}
        >
          {props.copy?.title ?? defaultCopy.inboxConfigTopic.title}
        </div>
        <div>
          <TopicList parentComponent="inbox" />
        </div>
      </div>
    </div>
  );
};
