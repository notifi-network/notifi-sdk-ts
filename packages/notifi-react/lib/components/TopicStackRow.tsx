import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTopicContext } from '../context';
import { defaultCopy } from '../utils';
import { TopicStandaloneRowMetadata } from './TopicList';
import { TopicStack } from './TopicStack';
import { TopicStackRowInput } from './TopicStackRowInput';

export type TopicStackRowProps = {
  className?: {
    container?: string;
    header?: string;
    headerTitle?: string;
    icon?: string;
    cta?: string;
    TopicStack?: TopicStackRowProps['className'];
    TopicStackRowInput?: TopicStackRowProps['className'];
  };
  copy?: {
    cta?: string;
  };
} & TopicStandaloneRowMetadata;

export const TopicStackRow: React.FC<TopicStackRowProps> = (props) => {
  const { getTopicStackAlertsFromTopicName } = useNotifiTopicContext();
  const topicStackAlerts = getTopicStackAlertsFromTopicName(
    props.topic.uiConfig.name,
  );

  const [isTopicStackRowInputVisible, setIsTopicStackRowInputVisible] =
    React.useState(topicStackAlerts.length === 0 ? true : false);

  return (
    <div className={clsx('notifi-topic-stack-row', props.className?.container)}>
      <div
        className={clsx(
          'notifi-topic-stack-row-header',
          props.className?.header,
        )}
      >
        <div
          className={clsx(
            'notifi-topic-stack-header-title',
            props.className?.headerTitle,
          )}
        >
          <div>{props.topic.uiConfig.name}</div>
          <Icon
            type="info"
            className={clsx(
              'notifi-topic-list-tooltip-icon',
              props.className?.icon,
            )}
          />
          {/* TODO: impl tooltip  */}
        </div>
      </div>
      {topicStackAlerts.length > 0 ? (
        <div className={clsx('notifi-topic-stacks')}>
          {topicStackAlerts.map((topicStackAlert, id) => {
            return (
              <TopicStack
                key={id}
                topicStackAlert={topicStackAlert}
                className={props.className?.TopicStack}
                topic={props.topic}
              />
            );
          })}
        </div>
      ) : null}

      {isTopicStackRowInputVisible ? (
        <TopicStackRowInput
          topic={props.topic}
          onSave={() => setIsTopicStackRowInputVisible(false)}
          classNames={props.className?.TopicStackRowInput}
        />
      ) : null}

      {!isTopicStackRowInputVisible ? (
        <div
          onClick={() => {
            setIsTopicStackRowInputVisible(true);
          }}
          className={clsx('notifi-topic-stack-row-cta', props.className?.cta)}
        >
          {props.copy?.cta ?? defaultCopy.topicStackRow.cta}
        </div>
      ) : null}
    </div>
  );
};
