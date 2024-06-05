import { FusionEventTopic } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { useNotifiTenantConfigContext } from '../context';
import { getFusionEventMetadata } from '../utils';
import { TopicRow, TopicRowPropsBase } from './TopicRow';
import { TopicStackRow, TopicStackRowProps } from './TopicStackRow';

export type TopicListProps = {
  classNames?: {
    container?: string;
    TopicRow?: TopicRowPropsBase['classNames'];
    TopicStackRow?: TopicStackRowProps['classNames'];
  };
};

export type TopicRowCategory = 'standalone' | 'group';

export type TopicRowMetadata<T extends TopicRowCategory> =
  T extends 'standalone' ? TopicStandaloneRowMetadata : TopicGroupRowMetadata;

type TopicRowMetadataBase = {
  index: number;
};

export type TopicStandaloneRowMetadata = TopicRowMetadataBase & {
  topic: FusionEventTopic;
};

export type TopicGroupRowMetadata = TopicRowMetadataBase & {
  topicGroupName: string;
  topics: FusionEventTopic[];
};

export const TopicList: React.FC<TopicListProps> = (props) => {
  const { fusionEventTopics } = useNotifiTenantConfigContext();

  // TODO: Move this to a hook
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
            // NOTE: Grouping not supported for TopicStackRow
            return (
              <TopicStackRow
                key={id}
                {...rowMetadata}
                classNames={props.classNames?.TopicRow}
              />
            );
          }
          return (
            <TopicRow<'standalone'>
              {...rowMetadata}
              key={id}
              classNames={props.classNames?.TopicRow}
            />
          );
        }
        if (isTopicGroupMetadata(rowMetadata)) {
          return (
            <TopicRow<'group'>
              key={id}
              {...rowMetadata}
              classNames={props.classNames?.TopicStackRow}
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
