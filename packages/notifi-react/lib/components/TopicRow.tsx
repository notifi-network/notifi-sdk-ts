import { FusionEventTopic } from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import { getUserInputParams } from '../utils';
import { Toggle } from './Toggle';
import { TopicOptions } from './TopicOptions';

export type TopicRowProps = {
  topic: FusionEventTopic;
  classNames?: {
    container?: string;
    baseRowContainer?: string;
    userInputsRowContainer?: string;
    content?: string;
    tooltipIcon?: string;
  };
};

export const TopicRow: React.FC<TopicRowProps> = (props) => {
  const topic = props.topic;
  const {
    isAlertSubscribed,
    isLoading: isLoadingTopic,
    subscribeAlertsDefault,
    unsubscribeAlert,
  } = useNotifiTopicContext();

  const {
    targetDocument: { targetGroupId },
  } = useNotifiTargetContext();

  const userInputParams = getUserInputParams(topic);

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
          <div>{topic.uiConfig.displayNameOverride ?? topic.uiConfig.name}</div>
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
          checked={isAlertSubscribed(topic.uiConfig.name)}
          disabled={isLoadingTopic}
          setChecked={() => {
            if (!targetGroupId) return;
            if (!isAlertSubscribed(topic.uiConfig.name)) {
              return subscribeAlertsDefault([props.topic], targetGroupId);
            }
            unsubscribeAlert(topic.uiConfig.name);
          }}
        />
      </div>

      {userInputParams.length > 0 && isAlertSubscribed(topic.uiConfig.name) ? (
        <div
          className={clsx(
            'notifi-topic-row-user-inputs-row-container ',
            props.classNames?.userInputsRowContainer,
          )}
        >
          {userInputParams.map((userInput, id) => {
            return (
              <TopicOptions key={id} userInputParam={userInput} topic={topic} />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};
