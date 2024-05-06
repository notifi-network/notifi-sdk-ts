import {
  AlertFilter,
  Filter,
  FusionEventMetadata,
  FusionEventTopic,
  UiType,
  UserInputParam,
} from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTargetContext, useNotifiTopicContext } from '../context';
import { Toggle } from './Toggle';

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
    <div>
      <div>
        <div>
          <div>{benchmarkTopic.uiConfig.topicGroupName}</div>
          <Icon type="info" />
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
        <div>
          {benchmarkUserInputParams.map((userInput, id) => {
            return (
              <div key={id}>
                {JSON.stringify(userInput)} || {JSON.stringify(props.topics)}
              </div>
              // TODO: render new component TopicGroupOptions (next section) ex. <TopicGroupOptions key={id} userInputParam={userInput} topics={props.topics} />
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

// Utils
const isTopicGroupValid = (topics: FusionEventTopic[]): boolean => {
  // Ensure all topics have the same userInputParams & options
  const benchmarkTopic = topics[0];
  const benchmarkTopicMetadata = JSON.parse(
    benchmarkTopic.fusionEventDescriptor.metadata ?? '{}',
  ) as FusionEventMetadata;
  const benchmarkAlertFilter =
    benchmarkTopicMetadata?.filters.find(isAlertFilter);
  const benchmarkUserInputParams = benchmarkAlertFilter?.userInputParams;

  if (!benchmarkAlertFilter) {
    return false;
  }

  if (benchmarkUserInputParams && benchmarkUserInputParams.length > 0) {
    const isGroupNameNotMatched = topics.find(
      (topic) =>
        topic.uiConfig.topicGroupName !==
        benchmarkTopic.uiConfig.topicGroupName,
    );
    if (isGroupNameNotMatched) {
      return false;
    }

    const userInputParamsList = topics.map((topic) => {
      return getUserInputParams(topic);
    });

    for (let i = 1; i < userInputParamsList.length; i++) {
      const userInputParams = userInputParamsList[i];
      const userInputParamMap = new Map<string, UserInputParam<UiType>>(
        userInputParams.map((userInputParam) => [
          userInputParam.name,
          userInputParam,
        ]),
      );

      const benchmarkUserInputParamMap = new Map<
        string,
        UserInputParam<UiType>
      >(
        benchmarkUserInputParams.map((userInputParam) => [
          userInputParam.name,
          userInputParam,
        ]),
      );
      // TODO: Fix O(n^2) complexity
      for (const key of benchmarkUserInputParamMap.keys()) {
        const benchmarkUserInputParam = benchmarkUserInputParamMap.get(key);
        const userInputParam = userInputParamMap.get(key);
        if (!userInputParam || !benchmarkUserInputParam) {
          return false;
        }

        const benchmarkParamOptions = benchmarkUserInputParam.options.join('');
        const userInputParamOptions = userInputParam.options.join('');
        if (benchmarkParamOptions !== userInputParamOptions) {
          return false;
        }

        if (
          benchmarkUserInputParam.defaultValue !== userInputParam.defaultValue
        ) {
          return false;
        }
      }
    }
  }
  return true;
};

// TODO: Migrate to NotifiTopicContext
const isAlertFilter = (filter: Filter): filter is AlertFilter => {
  return 'type' in filter && filter.type === 'AlertFilter';
};
// TODO: Migrate to NotifiTopicContext
const getUserInputParams = (
  topic: FusionEventTopic,
): UserInputParam<UiType>[] => {
  const parsedMetadata = JSON.parse(
    topic.fusionEventDescriptor.metadata ?? '{}',
  ) as FusionEventMetadata;
  const filters = parsedMetadata?.filters?.filter(isAlertFilter) ?? [];
  return filters[0]?.userInputParams ?? [];
};
