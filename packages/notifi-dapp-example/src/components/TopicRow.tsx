'use client';

import { Icon } from '@/assets/Icon';
import {
  getFusionFilter,
  getUiConfigOverride,
  getUserInputParams,
  isTopicGroupValid,
} from '@/utils/topic';
import { FusionEventTopic } from '@notifi-network/notifi-frontend-client';
import {
  useNotifiTargetContext,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { Toggle } from './Toggle';
import {
  TopicGroupRowMetadata,
  TopicRowCategory,
  TopicStandaloneRowMetadata,
} from './TopicList';
import { TopicOptions } from './TopicOptions';

type TopicGroupRowProps = TopicGroupRowMetadata;

type TopicStandaloneRowProps = TopicStandaloneRowMetadata;

export type TopicRowProps<T extends TopicRowCategory> = T extends 'standalone'
  ? TopicStandaloneRowProps
  : TopicGroupRowProps;

export const TopicRow = <T extends TopicRowCategory>(
  props: TopicRowProps<T>,
) => {
  const isTopicGroup = isTopicGroupRow(props);
  const {
    isAlertSubscribed,
    isLoading: isLoadingTopic,
    subscribeAlertsDefault,
    unsubscribeAlert,
  } = useNotifiTopicContext();

  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const benchmarkTopic = isTopicGroup ? props.topics[0] : props.topic;

  if (isTopicGroup && !isTopicGroupValid(props.topics)) return null;

  const userInputParams = getUserInputParams(benchmarkTopic);

  const uiConfigOverride = getUiConfigOverride(benchmarkTopic);

  const icon = uiConfigOverride?.icon ?? 'INFO';
  const customIconUrl = uiConfigOverride?.customIconUrl ?? '';

  const description = getFusionFilter(benchmarkTopic)?.description ?? '';

  const title = isTopicGroup
    ? props.topicGroupName
    : uiConfigOverride?.topicDisplayName &&
      uiConfigOverride?.topicDisplayName !== ''
    ? uiConfigOverride?.topicDisplayName
    : benchmarkTopic.uiConfig.name ?? benchmarkTopic.uiConfig.name;

  const toggleStandAloneTopic = async (topic: FusionEventTopic) => {
    if (!targetGroupId) return;
    if (!isAlertSubscribed(benchmarkTopic.uiConfig.name)) {
      return subscribeAlertsDefault([topic], targetGroupId);
    }
    unsubscribeAlert(benchmarkTopic.uiConfig.name);
  };

  const toggleTopicGroup = async (topics: FusionEventTopic[]) => {
    if (!targetGroupId) return;
    if (!isAlertSubscribed(benchmarkTopic.uiConfig.name)) {
      return subscribeAlertsDefault(topics, targetGroupId);
    }
    const topicsToBeUnsubscribed = topics.filter((topic) =>
      isAlertSubscribed(topic.uiConfig.name),
    );
    // TODO: replace with batch alert deletion (BE blocker)
    for (const topic of topicsToBeUnsubscribed) {
      await unsubscribeAlert(topic.uiConfig.name);
    }
  };

  return (
    <div className="flex flex-col p-2 px-4 bg-notifi-destination-card-bg rounded-md w-[359px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-row justify-center items-center text-sm font-regular text-notifi-text">
          <div className="flex flex-row items-center">
            {customIconUrl.length > 0 ? (
              <>
                <img src={customIconUrl} className="w-10 h-10 mr-3 ml-1" />
              </>
            ) : (
              <div className={`h-10 w-10 mr-3 ml-1`}>
                <Icon className="m-2" id={icon} />
              </div>
            )}
            <label>
              {title}
              <div className="group inline-block align-middle">
                {benchmarkTopic.uiConfig.tooltipContent ? (
                  <div className="relative">
                    <Icon id="info" className="text-notifi-text-light" />
                    <div className="hidden group-hover:block absolute text-sm font-normal max-w-48 bg-notifi-card-bg p-4 rounded-md z-10 border border-notifi-card-border w-48 bottom-[1.5rem] right-[-5rem]">
                      <div>{benchmarkTopic.uiConfig.tooltipContent}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </label>
          </div>
        </div>
        {/* hide toggle button if it is the Trading Pair Price Alert, but shown save button instead below */}
        <Toggle
          checked={isAlertSubscribed(benchmarkTopic.uiConfig.name)}
          disabled={isLoadingTopic}
          onChange={async () => {
            if (isTopicGroup) {
              return toggleTopicGroup(props.topics);
            }
            toggleStandAloneTopic(benchmarkTopic);
          }}
        />
      </div>

      {/* render radio button or button inputs if content with userInputParams length equals to 1 */}
      {isAlertSubscribed(benchmarkTopic.uiConfig.name) ? (
        <div>
          {isTopicGroup
            ? userInputParams.map((userInput, id) => {
                return (
                  <TopicOptions<'group'>
                    index={id}
                    key={id}
                    userInputParam={userInput}
                    topics={props.topics}
                    description={description}
                  />
                );
              })
            : null}
          {!isTopicGroup
            ? userInputParams.map((userInput, id) => {
                return (
                  <TopicOptions<'standalone'>
                    index={id}
                    key={id}
                    userInputParam={userInput}
                    topic={benchmarkTopic}
                    description={description}
                  />
                );
              })
            : null}
        </div>
      ) : null}
    </div>
  );
};

// Utils
const isTopicGroupRow = (
  props: TopicRowProps<TopicRowCategory>,
): props is TopicGroupRowProps => {
  return 'topics' in props && 'topicGroupName' in props;
};
