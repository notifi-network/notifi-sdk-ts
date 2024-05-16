import clsx from 'clsx';
import React from 'react';

import { TopicList } from './TopicList';

export type InboxConfigTopicProps = {
  classNames?: {
    container?: string;
  };
};

export const InboxConfigTopic: React.FC<InboxConfigTopicProps> = (props) => {
  return (
    <div
      className={clsx('notifi-inbox-config-topic', props.classNames?.container)}
    >
      <div>Dummy button Manage alert destinations</div>
      <div>
        <TopicList />
      </div>
    </div>
  );
};
