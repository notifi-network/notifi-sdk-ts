import clsx from 'clsx';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTopicContext } from '../context';
import { useComponentPosition } from '../hooks/useComponentPosition';
import {
  defaultCopy,
  getFusionEventMetadata,
  isEqual,
  isTopicGroupValid,
} from '../utils';
import {
  TopicGroupRowMetadata,
  TopicRowCategory,
  TopicStandaloneRowMetadata,
} from './TopicList';
import { TopicStack, TopicStackProps } from './TopicStack';
import {
  TopicStackRowInput,
  TopicStackRowInputPropsBase,
} from './TopicStackRowInput';

export type TopicStackRowPropsBase = {
  parentComponent?: 'inbox' | 'ftu';
  classNames?: {
    container?: string;
    header?: string;
    headerTitle?: string;
    icon?: string;
    cta?: string;
    tooltipContainer?: string;
    tooltipContent?: string;
    TopicStack?: TopicStackProps['classNames'];
    TopicStackRowInput?: TopicStackRowInputPropsBase['classNames'];
  };
  copy?: {
    cta?: string;
  };
};

type TopicStackGroupRowProps = TopicStackRowPropsBase & TopicGroupRowMetadata;

type TopicStackStandaloneRowProps = TopicStackRowPropsBase &
  TopicStandaloneRowMetadata;

export type TopicStackRowProps<T extends TopicRowCategory> =
  T extends 'standalone'
    ? TopicStackStandaloneRowProps
    : TopicStackGroupRowProps;

export const TopicStackRow = <T extends TopicRowCategory>(
  props: TopicStackRowProps<T>,
) => {
  const parentComponent = props.parentComponent ?? 'ftu';
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const { getTopicStackAlerts } = useNotifiTopicContext();
  const isTopicGroup = isTopicGroupRow(props);
  const benchmarkTopic = isTopicGroup ? props.topics[0] : props.topic;
  /* NOTE: benchmarkTopic is either the 'first topic in the group' or the 'standalone topic'. This represent the target topic to be rendered. */
  const fusionEventTypeId = benchmarkTopic.fusionEventDescriptor.id;
  if (!fusionEventTypeId) return null;
  if (isTopicGroup && !isTopicGroupValid(props.topics)) return null;

  // if (isTopicGroup) {
  // const topics = isTopicGroup ? props.topics : [benchmarkTopic];

  const alertsStack = React.useMemo(() => {
    const topics = isTopicGroup ? props.topics : [benchmarkTopic];
    const existingAlerts = topics.flatMap(
      (topic) => getTopicStackAlerts(topic.fusionEventDescriptor.id!), // Must has id (BE enforced)
    );

    const uniqueCriteria = new Map();

    existingAlerts.forEach((alert) => {
      const criteriaKey = JSON.stringify({
        filterOptions: alert.filterOptions,
        subscriptionValueInfo: alert.subscriptionValueInfo,
      });

      if (!uniqueCriteria.has(criteriaKey)) {
        uniqueCriteria.set(criteriaKey, alert);
      }
    });

    const alertsList = Array.from(uniqueCriteria.values()).map((uniqueAlert) =>
      existingAlerts.filter(
        (alert) =>
          isEqual(alert.filterOptions, uniqueAlert.filterOptions) &&
          isEqual(
            alert.subscriptionValueInfo,
            uniqueAlert.subscriptionValueInfo,
          ),
      ),
    );

    return alertsList;
  }, [getTopicStackAlerts, props]);

  const title = isTopicGroup
    ? props.topicGroupName
    : getFusionEventMetadata(benchmarkTopic)?.uiConfigOverride
        ?.topicDisplayName || // 1. Show topic displayname in fusionEventMetadata
      benchmarkTopic.uiConfig.displayNameOverride || // 2. Fall back to cardConfig'displayNameOverride  (May deprecated sooner or later)
      benchmarkTopic.uiConfig.name; // 3. Fall back to topic name

  const topicStackAlerts = getTopicStackAlerts(fusionEventTypeId);

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
                {benchmarkTopic.uiConfig.tooltipContent}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {alertsStack.length > 0 ? (
        <div className={clsx('notifi-topic-stacks')}>
          {alertsStack.map((alerts, id) => {
            return <TopicStack key={id} topicStackAlerts={alerts} />;
          })}
        </div>
      ) : null}

      {isTopicStackRowInputVisible || topicStackAlerts.length === 0 ? (
        <>
          {isTopicGroup ? (
            <TopicStackRowInput<'group'>
              topics={props.topics}
              onSave={() => setIsTopicStackRowInputVisible(false)}
              classNames={props.classNames?.TopicStackRowInput}
            />
          ) : null}
          {!isTopicGroup ? (
            <TopicStackRowInput<'standalone'>
              topic={props.topic}
              onSave={() => setIsTopicStackRowInputVisible(false)}
              classNames={props.classNames?.TopicStackRowInput}
            />
          ) : null}
        </>
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
// Utils
const isTopicGroupRow = (
  props: TopicStackRowProps<TopicRowCategory>,
): props is TopicStackGroupRowProps => {
  return 'topics' in props && 'topicGroupName' in props;
};
