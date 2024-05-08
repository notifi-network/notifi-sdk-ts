import { FusionEventTopic } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import { getUserInputParams, isTopicGroupValid } from '../utils';
import { Toggle } from './Toggle';
import {
  TopicGroupRowMetadata,
  TopicRowCategory,
  TopicStandaloneRowMetadata,
} from './TopicList';
import { TopicOptions } from './TopicOptions';

type TopicRowPropsBase = {
  classNames?: {
    container?: string;
    baseRowContainer?: string;
    userInputsRowContainer?: string;
    content?: string;
    tooltipIcon?: string;
  };
};

type TopicGroupRowProps = TopicRowPropsBase & TopicGroupRowMetadata;

type TopicStandaloneRowProps = TopicRowPropsBase & TopicStandaloneRowMetadata;

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
  /* NOTE: benchmarkTopic is either the 'first topic in the group' or the 'standalone topic'. This represent the target topic to be rendered. */

  if (isTopicGroup && !isTopicGroupValid(props.topics)) return null; // TODO: TBD partial valid case

  const userInputParams = getUserInputParams(benchmarkTopic);

  const title = isTopicGroup
    ? props.topicGroupName
    : benchmarkTopic.uiConfig.displayNameOverride ??
      benchmarkTopic.uiConfig.name;

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
    <div
      className={clsx('notifi-topic-row', props.classNames?.baseRowContainer)}
    >
      <div className={clsx('notifi-topic-row-base', props.classNames?.content)}>
        <div
          className={clsx(
            'notifi-topic-row-content',
            props.classNames?.content,
          )}
        >
          <div>{title}</div>
          <Icon
            type="info"
            className={clsx(
              'notifi-topic-list-tooltip-icon',
              props.classNames?.tooltipIcon,
            )}
          />
          {/* TODO: impl tooltip  */}
        </div>

        <Toggle
          checked={isAlertSubscribed(benchmarkTopic.uiConfig.name)}
          disabled={isLoadingTopic}
          setChecked={async () => {
            if (isTopicGroup) {
              return toggleTopicGroup(props.topics);
            }
            toggleStandAloneTopic(benchmarkTopic);
          }}
        />
      </div>
      {userInputParams.length > 0 &&
      isAlertSubscribed(benchmarkTopic.uiConfig.name) ? (
        <div
          className={clsx(
            'notifi-topic-row-user-inputs-row-container ',
            props.classNames?.userInputsRowContainer,
          )}
        >
          {isTopicGroup
            ? userInputParams.map((userInput, id) => {
                return (
                  <TopicOptions<'group'>
                    key={id}
                    userInputParam={userInput}
                    topics={props.topics}
                  />
                );
              })
            : null}
          {!isTopicGroup
            ? userInputParams.map((userInput, id) => {
                return (
                  <TopicOptions<'standalone'>
                    key={id}
                    userInputParam={userInput}
                    topic={benchmarkTopic}
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
