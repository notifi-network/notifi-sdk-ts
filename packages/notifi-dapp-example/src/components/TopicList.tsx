'use client';

import {
  FusionEventTopic,
  TopicMetadata,
} from '@notifi-network/notifi-frontend-client';
import {
  getFusionEventMetadata,
  useNotifiTenantConfigContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { TopicRow } from './TopicRow';
import { TopicStackRow } from './TopicStackRow';

export type TopicListProps = {
  title?: string;
  inFTU?: boolean;
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

export const TopicList: React.FC<TopicListProps> = ({
  title,
  inFTU = false,
}) => {
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
    <div
      className={`flex flex-col items-center 2xl:px-[15.75rem] xl:px-[10rem] ${
        inFTU ? '' : 'md:min-h-[94vh]'
      } grow h-full mb-9`}
    >
      {title ? (
        <div className="mt-8 mb-6 font-regular text-lg text-notifi-text">
          {title}
        </div>
      ) : null}
      <div className="flex flex-col gap-4 justify-center w-86">
        {topicRows.map((rowMetadata, id) => {
          if (isTopicStandaloneMetadata(rowMetadata)) {
            const isSubscriptionValueInputable = getFusionEventMetadata(
              rowMetadata.topic,
            )?.uiConfigOverride?.isSubscriptionValueInputable;
            if (isSubscriptionValueInputable) {
              return <TopicStackRow<'standalone'> key={id} {...rowMetadata} />;
            }
            return <TopicRow<'standalone'> {...rowMetadata} key={id} />;
          }
          if (isTopicGroupMetadata(rowMetadata)) {
            const isSubscriptionValueInputable = getFusionEventMetadata(
              rowMetadata.topics[0],
            )?.uiConfigOverride?.isSubscriptionValueInputable;
            if (isSubscriptionValueInputable) {
              return <TopicStackRow<'group'> key={id} {...rowMetadata} />;
            }
            return <TopicRow<'group'> key={id} {...rowMetadata} />;
          }
        })}
      </div>
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
