import {
  FusionEventTopic,
  TopicMetadata,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTenantConfigContext } from '../context';
import { getFusionEventMetadata } from '../utils';
import { TopicRow, TopicRowPropsBase } from './TopicRow';
import { TopicStackRow, TopicStackRowPropsBase } from './TopicStackRow';

export type TopicListProps = {
  classNames?: {
    container?: string;
    TopicRow?: TopicRowPropsBase['classNames'];
    TopicStackRow?: TopicStackRowPropsBase['classNames'];
  };
  parentComponent?: 'inbox' | 'ftu';
};

export type TopicRowCategory = 'standalone' | 'group';

export type TopicRowMetadata<T extends TopicRowCategory> =
  T extends 'standalone' ? TopicStandaloneRowMetadata : TopicGroupRowMetadata;

type TopicRowMetadataBase = {
  index: number;
};

export type TopicStandaloneRowMetadata = TopicRowMetadataBase & {
  topic: FusionEventTopic | TopicMetadata;
};

export type TopicGroupRowMetadata = TopicRowMetadataBase & {
  topicGroupName: string;
  topics: (FusionEventTopic | TopicMetadata)[];
};

export const TopicList: React.FC<TopicListProps> = (props) => {
  const parentComponent = props.parentComponent ?? 'ftu';
  const { fusionEventTopics } = useNotifiTenantConfigContext();

  const topicRows = React.useMemo(() => {
    const fusionEventTopicGroups: Record<string, TopicGroupRowMetadata> = {};
    const fusionEventStandaloneTopics: TopicStandaloneRowMetadata[] = [];
    fusionEventTopics.forEach((topic, index) => {
      if (topic.uiConfig.topicGroupName) {
        if (!fusionEventTopicGroups[topic.uiConfig.topicGroupName]) {
          fusionEventTopicGroups[topic.uiConfig.topicGroupName] = {
            index,
            topicGroupName: topic.uiConfig.topicGroupName,
            topics: [topic],
          };
        } else {
          fusionEventTopicGroups[topic.uiConfig.topicGroupName].topics.push(
            topic,
          );
        }
        return;
      }
      fusionEventStandaloneTopics.push({ topic, index });
    });

    return [
      ...Object.values(fusionEventTopicGroups),
      ...fusionEventStandaloneTopics,
    ].sort((a, b) => a.index - b.index);
  }, [fusionEventTopics]);

  return (
    <div className={clsx('notifi-topic-list', props.classNames?.container)}>
      {topicRows.map((rowMetadata, id) => {
        if (isTopicStandaloneMetadata(rowMetadata)) {
          const isSubscriptionValueInputable = getFusionEventMetadata(
            rowMetadata.topic,
          )?.uiConfigOverride?.isSubscriptionValueInputable;
          if (isSubscriptionValueInputable) {
            return (
              <TopicStackRow<'standalone'>
                key={id}
                {...rowMetadata}
                classNames={props.classNames?.TopicRow}
                parentComponent={parentComponent}
              />
            );
          }
          return (
            <TopicRow<'standalone'>
              {...rowMetadata}
              key={id}
              classNames={props.classNames?.TopicRow}
              parentComponent={parentComponent}
            />
          );
        }
        if (isTopicGroupMetadata(rowMetadata)) {
          const isSubscriptionValueInputable = getFusionEventMetadata(
            rowMetadata.topics[0],
          )?.uiConfigOverride?.isSubscriptionValueInputable;

          if (isSubscriptionValueInputable) {
            return (
              <TopicStackRow<'group'>
                key={id}
                {...rowMetadata}
                classNames={props.classNames?.TopicRow}
                parentComponent={parentComponent}
              />
            );
          }
          return (
            <TopicRow<'group'>
              key={id}
              {...rowMetadata}
              classNames={props.classNames?.TopicStackRow}
              parentComponent={parentComponent}
            />
          );
        }
      })}
    </div>
  );
};

// Utils

const isTopicStandaloneMetadata = (
  topicRowMetadata: TopicRowMetadata<TopicRowCategory>,
): topicRowMetadata is TopicStandaloneRowMetadata => {
  return 'topic' in topicRowMetadata;
};

const isTopicGroupMetadata = (
  topicRowMetadata: TopicRowMetadata<TopicRowCategory>,
): topicRowMetadata is TopicGroupRowMetadata => {
  return 'topicGroupName' in topicRowMetadata && 'topics' in topicRowMetadata;
};
