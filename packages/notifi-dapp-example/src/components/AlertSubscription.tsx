'use client';

import { FusionEventTopic } from '@notifi-network/notifi-frontend-client';
import { useNotifiTenantConfigContext } from '@notifi-network/notifi-react';
import React from 'react';

import { AlertSubscriptionRow } from './AlertSubscriptionRow';

export type AlertSubscriptionProps = {
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
  topic: FusionEventTopic;
};

export type TopicGroupRowMetadata = TopicRowMetadataBase & {
  topicGroupName: string;
  topics: FusionEventTopic[];
};

export const AlertSubscription: React.FC<AlertSubscriptionProps> = ({
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
      } grow h-full`}
    >
      {title ? (
        <div className="mt-8 mb-6 font-regular text-lg text-notifi-text">
          {title}
        </div>
      ) : null}
      <div className="flex flex-col gap-4 justify-center w-86 mb-6 pb-28">
        {topicRows.map((rowMetadata, id) => {
          if (isTopicStandaloneMetadata(rowMetadata)) {
            return (
              <AlertSubscriptionRow<'standalone'> {...rowMetadata} key={id} />
            );
          }
          if (isTopicGroupMetadata(rowMetadata)) {
            return <AlertSubscriptionRow<'group'> {...rowMetadata} key={id} />;
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
