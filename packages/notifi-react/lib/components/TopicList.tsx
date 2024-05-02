import clsx from 'clsx';
import React from 'react';

import { useNotifiTenantConfigContext } from '../context';
import { TopicRow } from './TopicRow';

export type TopicListProps = {
  classNames?: {
    container?: string;
  };
};

export const TopicList: React.FC<TopicListProps> = (props) => {
  const { fusionEventTopics } = useNotifiTenantConfigContext();
  return (
    <div className={clsx('notifi-topic-list', props.classNames?.container)}>
      {fusionEventTopics.map((topic) => (
        <TopicRow topic={topic} key={topic.uiConfig.name} />
      ))}
    </div>
  );
};
