import { FusionEventTopic } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import { useComponentPosition } from '../hooks/useComponentPosition';
import {
  getFusionEventMetadata,
  getUserInputParams,
  isTopicGroupValid,
} from '../utils';
import { Toggle } from './Toggle';
import {
  TopicGroupRowMetadata,
  TopicRowCategory,
  TopicStandaloneRowMetadata,
} from './TopicList';
import { TopicOptions } from './TopicOptions';

export type TopicRowPropsBase = {
  parentComponent?: 'inbox' | 'ftu';
  classNames?: {
    container?: string;
    baseRowContainer?: string;
    userInputsRowContainer?: string;
    content?: string;
    tooltipContainer?: string;
    tooltipIcon?: string;
    tooltipContent?: string;
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
  const parentComponent = props.parentComponent ?? 'ftu';
  const tooltipRef = React.useRef<HTMLDivElement>(null);
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
  const fusionEventTypeId = benchmarkTopic.fusionEventDescriptor.id;
  if (!fusionEventTypeId) return null;
  if (isTopicGroup && !isTopicGroupValid(props.topics)) return null;

  const userInputParams = getUserInputParams(benchmarkTopic);

  const title = isTopicGroup
    ? props.topicGroupName
    : getFusionEventMetadata(benchmarkTopic)?.uiConfigOverride
        ?.topicDisplayName || // 1. Show topic displayname in fusionEventMetadata
      benchmarkTopic.uiConfig.displayNameOverride || // 2. Fall back to cardConfig'displayNameOverride  (May deprecated sooner or later)
      benchmarkTopic.uiConfig.name; // 3. Fall back to topic name

  const toggleStandAloneTopic = async (topic: FusionEventTopic) => {
    if (!targetGroupId) return;
    if (!isAlertSubscribed(fusionEventTypeId)) {
      return subscribeAlertsDefault([topic], targetGroupId);
    }
    unsubscribeAlert(fusionEventTypeId);
  };

  const toggleTopicGroup = async (topics: FusionEventTopic[]) => {
    if (!targetGroupId) return;
    if (!isAlertSubscribed(fusionEventTypeId)) {
      return subscribeAlertsDefault(topics, targetGroupId);
    }
    const topicsToBeUnsubscribed = topics.filter((topic) =>
      topic.fusionEventDescriptor.id
        ? isAlertSubscribed(topic.fusionEventDescriptor.id)
        : false,
    );
    for (const topic of topicsToBeUnsubscribed) {
      await unsubscribeAlert(topic.fusionEventDescriptor.id!);
    }
  };

  const { componentPosition: tooltipPosition } = useComponentPosition(
    tooltipRef,
    parentComponent === 'inbox'
      ? 'notifi-inbox-config-topic-main'
      : 'notifi-ftu-alert-edit-main',
  );

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
          {benchmarkTopic.uiConfig.tooltipContent ? (
            <div
              ref={tooltipRef}
              className={clsx(
                'notifi-topic-list-tooltip-container',
                props.classNames?.tooltipContainer,
              )}
            >
              <Icon
                type="info"
                className={clsx(
                  'notifi-topic-list-tooltip-icon',
                  props.classNames?.tooltipIcon,
                )}
              />

              <div
                className={clsx(
                  'notifi-topic-list-tooltip-content',
                  props.classNames?.tooltipContent,
                  tooltipPosition,
                )}
              >
                {benchmarkTopic.uiConfig.tooltipContent}
              </div>
            </div>
          ) : null}
        </div>

        <Toggle
          checked={isAlertSubscribed(fusionEventTypeId)}
          disabled={isLoadingTopic}
          setChecked={async () => {
            if (isTopicGroup) {
              return toggleTopicGroup(props.topics);
            }
            toggleStandAloneTopic(benchmarkTopic);
          }}
        />
      </div>
      {userInputParams.length > 0 && isAlertSubscribed(fusionEventTypeId) ? (
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
