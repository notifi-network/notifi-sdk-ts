'use client';

import { Icon } from '@/assets/Icon';
import {
  FusionEventTopic,
  TopicMetadata,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import {
  getFusionFilter,
  getUiConfigOverride,
  getUserInputParams,
  isTopicGroupValid,
  useNotifiTargetContext,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { Tooltip } from '../../Tooltip';
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
    unsubscribeAlerts,
  } = useNotifiTopicContext();

  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const benchmarkTopic = isTopicGroup ? props.topics[0] : props.topic;

  const fusionEventTypeId = benchmarkTopic.fusionEventDescriptor.id;
  if (!fusionEventTypeId) return null;

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
      : (benchmarkTopic.uiConfig.name ?? benchmarkTopic.uiConfig.name);

  const toggleTopic = async (topics: (FusionEventTopic | TopicMetadata)[]) => {
    if (!targetGroupId || topics.length === 0) return;
    if (!isAlertSubscribed(fusionEventTypeId)) {
      await subscribeAlertsDefault(topics, targetGroupId);
      return;
    }
    const topicsToBeUnsubscribed = topics.filter((topic) =>
      topic.fusionEventDescriptor.id
        ? isAlertSubscribed(topic.fusionEventDescriptor.id)
        : false,
    );
    const alertIds = topicsToBeUnsubscribed.map(
      (topic) => topic.fusionEventDescriptor.id!,
    );
    await unsubscribeAlerts(alertIds);
  };

  const correctUserInputParamsOrder = (
    userInputParams: UserInputParam<UiType>[],
  ) => {
    if (userInputParams.length > 0 && userInputParams[0].uiType === 'radio') {
      return userInputParams;
    } else {
      const reversedParams = [...userInputParams].reverse();
      return reversedParams;
    }
  };

  return (
    <div className="flex flex-col p-2 px-4 bg-notifi-destination-card-bg rounded-md md:w-[359px]">
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
            <label>{title}</label>
          </div>
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="group inline-block align-middle">
            {benchmarkTopic.uiConfig.tooltipContent ? (
              <Tooltip>{benchmarkTopic.uiConfig.tooltipContent}</Tooltip>
            ) : null}
          </div>
          {/* hide toggle button if it is the Trading Pair Price Alert, but shown save button instead below */}
          <Toggle
            checked={isAlertSubscribed(fusionEventTypeId)}
            disabled={isLoadingTopic}
            setChecked={async () => {
              toggleTopic(isTopicGroup ? props.topics : [props.topic]);
            }}
          />
        </div>
      </div>

      {/* render radio button or button inputs if content with userInputParams length equals to 1 */}
      {isAlertSubscribed(fusionEventTypeId) ? (
        <div>
          {isTopicGroup
            ? correctUserInputParamsOrder(userInputParams).map(
                (userInput, id) => {
                  return (
                    <TopicOptions<'group'>
                      index={id}
                      key={id}
                      userInputParam={userInput}
                      topics={props.topics}
                      description={description}
                    />
                  );
                },
              )
            : null}
          {!isTopicGroup
            ? correctUserInputParamsOrder(userInputParams).map(
                (userInput, id) => {
                  return (
                    <TopicOptions<'standalone'>
                      index={id}
                      key={id}
                      userInputParam={userInput}
                      topic={benchmarkTopic}
                      description={description}
                    />
                  );
                },
              )
            : null}
        </div>
      ) : null}
    </div>
  );
};

// Utils
export const isTopicGroupRow = (
  props: TopicRowProps<TopicRowCategory>,
): props is TopicGroupRowProps => {
  return 'topics' in props && 'topicGroupName' in props;
};
