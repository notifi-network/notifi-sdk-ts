import { FusionEventTopic } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import { getUserInputParams, isTopicGroupValid } from '../utils';
import { Toggle } from './Toggle';
import { TopicGroupOptions } from './TopicGroupOptions';

export type TopicGroupRowProps = {
  topics: FusionEventTopic[];
  // Others ...
};
export const TopicGroupRow: React.FC<TopicGroupRowProps> = (props) => {
  if (!isTopicGroupValid(props.topics)) return null; // TODO: TBD partial valid case

  const {
    isAlertSubscribed,
    isLoading: isLoadingTopic,
    subscribeAlertsDefault,
    unsubscribeAlert,
  } = useNotifiTopicContext();

  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const benchmarkTopic = props.topics[0];
  const benchmarkUserInputParams = getUserInputParams(benchmarkTopic);

  return (
    <div className={clsx('notifi-topic-row')}>
      <div className={clsx('notifi-topic-row-base')}>
        <div className={clsx('notifi-topic-row-content')}>
          <div>{benchmarkTopic.uiConfig.topicGroupName}</div>
          <Icon
            type="info"
            className={clsx('notifi-topic-list-tooltip-icon')}
          />
          {/* TODO: impl tooltip  */}
        </div>
        <Toggle
          checked={isAlertSubscribed(benchmarkTopic.uiConfig.name)}
          disabled={isLoadingTopic}
          setChecked={async () => {
            if (!targetGroupId) return;
            if (!isAlertSubscribed(benchmarkTopic.uiConfig.name)) {
              const topicsToBeSubscribed = props.topics.filter(
                (topic) => !isAlertSubscribed(topic.uiConfig.name),
              );
              await subscribeAlertsDefault(topicsToBeSubscribed, targetGroupId);
              return;
            }
            const topicsToBeUnsubscribed = props.topics.filter((topic) =>
              isAlertSubscribed(topic.uiConfig.name),
            );
            // TODO: impl batch alert deletion (BE blocker)
            for (const topic of topicsToBeUnsubscribed) {
              await unsubscribeAlert(topic.uiConfig.name);
            }
          }}
        />
      </div>

      {benchmarkUserInputParams &&
      benchmarkUserInputParams.length > 0 &&
      isAlertSubscribed(benchmarkTopic.uiConfig.name) ? (
        <div className={clsx('notifi-topic-row-user-inputs-row-container')}>
          {benchmarkUserInputParams.map((userInput, id) => {
            return (
              <div key={id}>
                <TopicGroupOptions
                  key={id}
                  topics={props.topics}
                  userInputParam={userInput}
                />
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
