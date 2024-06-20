import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTopicContext } from '../context';
import { useComponentPosition } from '../hooks/useComponentPosition';
import { defaultCopy } from '../utils';
import { TopicStandaloneRowMetadata } from './TopicList';
import { TopicStack } from './TopicStack';
import { TopicStackRowInput } from './TopicStackRowInput';

export type TopicStackRowProps = {
  parentComponent?: 'inbox' | 'ftu';
  classNames?: {
    container?: string;
    header?: string;
    headerTitle?: string;
    icon?: string;
    cta?: string;
    tooltipContainer?: string;
    tooltipContent?: string;
    TopicStack?: TopicStackRowProps['classNames'];
    TopicStackRowInput?: TopicStackRowProps['classNames'];
  };
  copy?: {
    cta?: string;
  };
} & TopicStandaloneRowMetadata;

export const TopicStackRow: React.FC<TopicStackRowProps> = (props) => {
  const parentComponent = props.parentComponent ?? 'ftu';
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const { getTopicStackAlerts } = useNotifiTopicContext();
  if (!props.topic.fusionEventDescriptor.id) return null;

  const topicStackAlerts = getTopicStackAlerts(
    props.topic.fusionEventDescriptor.id,
  );

  const [isTopicStackRowInputVisible, setIsTopicStackRowInputVisible] =
    React.useState(topicStackAlerts.length === 0 ? true : false);

  const { componentPosition: tooltipPosition } = useComponentPosition(
    tooltipRef,
    parentComponent === 'inbox'
      ? 'notifi-inbox-config-topic-main'
      : 'notifi-ftu-alert-edit-main',
  );

  return (
    <div
      className={clsx('notifi-topic-stack-row', props.classNames?.container)}
    >
      <div
        className={clsx(
          'notifi-topic-stack-row-header',
          props.classNames?.header,
        )}
      >
        <div
          className={clsx(
            'notifi-topic-stack-header-title',
            props.classNames?.headerTitle,
          )}
        >
          <div>{props.topic.uiConfig.name}</div>

          {props.topic.uiConfig.tooltipContent ? (
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
                  props.classNames?.icon,
                )}
              />

              <div
                className={clsx(
                  'notifi-topic-list-tooltip-content',
                  props.classNames?.tooltipContent,
                  tooltipPosition,
                )}
              >
                {props.topic.uiConfig.tooltipContent}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {topicStackAlerts.length > 0 ? (
        <div className={clsx('notifi-topic-stacks')}>
          {topicStackAlerts.map((topicStackAlert, id) => {
            return (
              <TopicStack
                key={id}
                topicStackAlert={topicStackAlert}
                className={props.classNames?.TopicStack}
                topic={props.topic}
              />
            );
          })}
        </div>
      ) : null}

      {isTopicStackRowInputVisible || topicStackAlerts.length === 0 ? (
        <TopicStackRowInput
          topic={props.topic}
          onSave={() => setIsTopicStackRowInputVisible(false)}
          classNames={props.classNames?.TopicStackRowInput}
        />
      ) : null}

      {isTopicStackRowInputVisible || topicStackAlerts.length === 0 ? null : (
        <div
          onClick={() => {
            setIsTopicStackRowInputVisible(true);
          }}
          className={clsx('notifi-topic-stack-row-cta', props.classNames?.cta)}
        >
          {props.copy?.cta ?? defaultCopy.topicStackRow.cta}
        </div>
      )}
    </div>
  );
};
