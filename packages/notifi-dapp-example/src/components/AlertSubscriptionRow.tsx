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

import {
  TopicGroupRowMetadata,
  TopicRowCategory,
  TopicStandaloneRowMetadata,
} from './AlertSubscription';
import { AlertSubscriptionOptions } from './AlertSubscriptionOptions';
import { SubscriptionValueInput } from './SubscriptionValueInput';
import { Toggle } from './Toggle';

type TopicGroupRowProps = TopicGroupRowMetadata;

type TopicStandaloneRowProps = TopicStandaloneRowMetadata;

export type AlertSubscriptionRowProps<T extends TopicRowCategory> =
  T extends 'standalone' ? TopicStandaloneRowProps : TopicGroupRowProps;

export const AlertSubscriptionRow = <T extends TopicRowCategory>(
  props: AlertSubscriptionRowProps<T>,
) => {
  const isTopicGroup = isTopicGroupRow(props);
  const [isAddPairOpen, setIsAddPairOpen] = React.useState<boolean>(false);
  const tradingPairAlertsList = [
    { 'ETH / USDC - Chain': 'Above 15928.00' },
    { 'ETH / USDC - Chain': 'Above 15928.00' },
  ];
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

  const isSubscriptionValueInputable =
    uiConfigOverride?.isSubscriptionValueInputable ?? false;

  const description = getFusionFilter(benchmarkTopic)?.description ?? '';

  const reversedParams = [...userInputParams].reverse();

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
                    <div className="hidden group-hover:block absolute text-sm font-medium max-w-48 bg-notifi-card-bg p-4 rounded-md z-10 border border-notifi-card-border w-48 bottom-[1.5rem] right-[-5rem]">
                      <div>{benchmarkTopic.uiConfig.tooltipContent}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </label>
          </div>
        </div>
        {/* hide toggle button if it is the Trading Pair Price Alert, but shown save button instead below */}
        {/* {userInputParams.length > 1 ? null : ( */}
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
        {/* )} */}
      </div>

      {/* show Trading Pair Price Alert list if there are any
      using dummy data now TODO: update with real */}
      {userInputParams.length > 1 ? (
        <div className="ml-14 flex flex-col border-t border-b border-notifi-card-border mt-2 mb-4 mr-6">
          {tradingPairAlertsList.map((item, index) => (
            <div className="flex flex-row justify-between items-center py-3">
              <div key={index} className="flex flex-col items-start">
                <div className="text-sm font-regular text-notifi-text">
                  {Object.keys(item)[0]}
                </div>
                <div className="text-xs font-regular text-notifi-text-light">
                  {Object.values(item)[0]}
                </div>
              </div>
              <Icon
                id="trash-btn"
                className="text-notifi-text-light top-6 left-4 cursor-pointer"
                // onClick={() => unsubscribeAlert(topic.uiConfig.name)}
              />
            </div>
          ))}
        </div>
      ) : null}

      {/* show dropdown button for Trading Pair Price Alert */}
      {/* TODO: pass in a variable from AP to determine if the dropdown should be shown */}
      {isSubscriptionValueInputable ? <SubscriptionValueInput /> : null}

      {/* render radio button or button inputs if content with userInputParams length equals to 1 */}
      {userInputParams.length === 1 &&
      isAlertSubscribed(benchmarkTopic.uiConfig.name) ? (
        <div>
          {isTopicGroup
            ? userInputParams.map((userInput, id) => {
                return (
                  <AlertSubscriptionOptions<'group'>
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
                  <AlertSubscriptionOptions<'standalone'>
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

      {/* render radio button or button inputs if content with userInputParams length larger than 1, for GMX, it is the Trading Pair Price Alert */}
      {userInputParams.length > 1 && isAddPairOpen ? (
        <div>
          {isTopicGroup
            ? reversedParams.map((userInput, id) => {
                return (
                  <AlertSubscriptionOptions<'group'>
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
            ? reversedParams.map((userInput, id) => {
                return (
                  <AlertSubscriptionOptions<'standalone'>
                    index={id}
                    key={id}
                    userInputParam={userInput}
                    topic={benchmarkTopic}
                    description={description}
                  />
                );
              })
            : null}
          <button
            className="ml-14 h-9 w-18 rounded-lg bg-notifi-button-primary-blueish-bg text-notifi-button-primary-text mt-1 mb-4"
            onClick={() => {
              if (!targetGroupId) return;
              if (!isAlertSubscribed(benchmarkTopic.uiConfig.name)) {
                if (isTopicGroup) {
                  return toggleTopicGroup(props.topics);
                }
                toggleStandAloneTopic(benchmarkTopic);
              }
              setIsAddPairOpen(false);
            }}
          >
            Save
          </button>
        </div>
      ) : null}

      {/* add pair for Trading Pair Price Alert  */}
      {userInputParams.length > 1 ? (
        <div className="border-t border-notifi-card-border ml-14 mr-6">
          <div
            className="text-sm font-medium text-notifi-tenant-brand-bg py-2 cursor-pointer"
            onClick={() => setIsAddPairOpen(true)}
          >
            + Add Pair
          </div>
        </div>
      ) : null}
    </div>
  );
};

// Utils
const isTopicGroupRow = (
  props: AlertSubscriptionRowProps<TopicRowCategory>,
): props is TopicGroupRowProps => {
  return 'topics' in props && 'topicGroupName' in props;
};
