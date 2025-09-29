import { Icon } from '@/assets/Icon';
import {
  TopicStackAlert,
  getFusionEventMetadata,
  isEqual,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import React from 'react';

import { Tooltip } from './Tooltip';
import { TopicRowCategory } from './TopicList';
import { TopicRowProps, isTopicGroupRow } from './TopicRow';
import { TopicStack } from './TopicStack';
import { TopicStackRowInput } from './TopicStackRowInput';

export const TopicStackRow = <T extends TopicRowCategory>(
  props: TopicRowProps<T>,
) => {
  const isTopicGroup = isTopicGroupRow(props);
  const { getTopicStackAlerts } = useNotifiTopicContext();
  const benchmarkTopic = isTopicGroup ? props.topics[0] : props.topic;
  const fusionEventTypeId = benchmarkTopic.fusionEventDescriptor.id;
  if (!fusionEventTypeId) return null;

  const topicStackAlerts = getTopicStackAlerts(fusionEventTypeId);
  const customIconUrl =
    getFusionEventMetadata(benchmarkTopic)?.uiConfigOverride?.customIconUrl ??
    '';
  const icon =
    getFusionEventMetadata(benchmarkTopic)?.uiConfigOverride?.icon ?? 'INFO';
  const title =
    getFusionEventMetadata(benchmarkTopic)?.uiConfigOverride
      ?.topicDisplayName ?? '';
  const isTradingPairAlert = title.includes('Pair');
  const [isTopicStackRowInputVisible, setIsTopicStackRowInputVisible] =
    React.useState(topicStackAlerts.length > 0 ? false : true);

  const alertsStack = React.useMemo(() => {
    const topics = isTopicGroup ? props.topics : [benchmarkTopic];
    const existingAlerts: TopicStackAlert[] = topics.flatMap((topic) =>
      getTopicStackAlerts(topic.fusionEventDescriptor.id!),
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
            <label>
              {title}
              <div className="group inline-block align-middle">
                {benchmarkTopic.uiConfig.tooltipContent ? (
                  <Tooltip>{benchmarkTopic.uiConfig.tooltipContent}</Tooltip>
                ) : null}
              </div>
            </label>
          </div>
        </div>
      </div>
      {topicStackAlerts.length > 0 ? (
        <div className="ml-14 flex flex-col border-t border-notifi-card-border my-2 mr-6">
          {alertsStack.map((topicStackAlert, id) => {
            return <TopicStack key={id} topicStackAlerts={topicStackAlert} />;
          })}
        </div>
      ) : null}

      {isTopicStackRowInputVisible || topicStackAlerts.length === 0 ? (
        isTopicGroup ? (
          <TopicStackRowInput
            topics={props.topics}
            onSave={() => setIsTopicStackRowInputVisible(false)}
          />
        ) : (
          <TopicStackRowInput
            topic={props.topic}
            onSave={() => setIsTopicStackRowInputVisible(false)}
          />
        )
      ) : null}
      {isTopicStackRowInputVisible || topicStackAlerts.length === 0 ? null : (
        <div className=" ml-14 mr-6">
          <div
            className={`text-sm font-medium text-notifi-tenant-brand-bg py-2 cursor-pointer ${
              topicStackAlerts.length > 0
                ? ''
                : ' border-t border-notifi-card-border'
            }`}
            onClick={() => {
              setIsTopicStackRowInputVisible(true);
            }}
          >
            {isTradingPairAlert ? '+ Add Pair' : '+ Add Fee Rate Alert'}
          </div>
        </div>
      )}
    </div>
  );
};
