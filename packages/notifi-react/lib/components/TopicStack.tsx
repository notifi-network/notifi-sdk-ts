import {
  FusionEventTopic,
  UserInputOptions,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import { ValueType } from 'notifi-frontend-client/dist';
import React from 'react';

import { Icon } from '../assets/Icons';
import { useNotifiTopicContext } from '../context';
import {
  ConvertOptionDirection,
  TopicStackAlert,
  convertOptionValue,
  derivePrefixAndSuffixFromValueType,
  getFusionEventMetadata,
  isAlertFilter,
} from '../utils';

type TopicStackProps = {
  topicStackAlert: TopicStackAlert;
  className?: {
    container?: string;
    contentContainer?: string;
    title?: string;
    subtitle?: string;
    cta?: string;
  };
  topic: FusionEventTopic;
};

type InputParmValueMetadata = {
  valueType: ValueType;
  prefixAndSuffix: {
    prefix: string;
    suffix: string;
  } | null;
};

export const TopicStack: React.FC<TopicStackProps> = (props) => {
  const { unsubscribeAlert, getAlertFilterOptions } = useNotifiTopicContext();
  const userInputOptions = React.useMemo(() => {
    const input = getAlertFilterOptions(props.topicStackAlert.alertName)?.input;
    if (!input) return;
    return Object.values(input)[0];
  }, [getAlertFilterOptions]);

  const { isLoading } = useNotifiTopicContext();

  const fusionEventMetadata = getFusionEventMetadata(props.topic);
  const alertFilter = fusionEventMetadata?.filters.find(isAlertFilter);

  if (!alertFilter) {
    return null;
  }

  const userInputParmValueMetadataMap = new Map(
    alertFilter.userInputParams.map((param) => [
      param.name,
      { valueType: param.kind, prefixAndSuffix: param.prefixAndSuffix ?? null },
    ]),
  );

  const userInputOptionValuesToBeDisplayed =
    userInputOptions &&
    isAboveOrBelowThresholdUserInputOptions(userInputOptions)
      ? sortAboveOrBelowThresholdUserInputOptionValue(
          userInputOptions,
          userInputParmValueMetadataMap,
        )
      : [];

  return (
    <div className={clsx('notifi-topic-stack', props.className?.container)}>
      <div
        className={clsx(
          'notifi-topic-stack-content',
          props.className?.contentContainer,
        )}
      >
        <div
          className={clsx(
            'notifi-topic-stack-content-title',
            props.className?.subtitle,
          )}
        >
          {props.topicStackAlert.subscriptionValueInfo.label}
        </div>
        <div
          className={clsx(
            'notifi-topic-stack-content-subtitle',
            props.className?.subtitle,
          )}
        >
          {userInputOptionValuesToBeDisplayed.map((option, id) => (
            <div key={id}>{option}</div>
          ))}
        </div>
      </div>

      <div
        className={clsx(
          'notifi-topic-stack-cta',
          props.className?.cta,
          isLoading ? 'disabled' : '',
        )}
        onClick={() => {
          if (isLoading) return;
          unsubscribeAlert(props.topicStackAlert.alertName);
        }}
      >
        <Icon type="bin" />
      </div>
    </div>
  );
};

// Utils

// TODO: refactor & consolidate this type with `UserInputOptions` from `@notifi-network/notifi-frontend-client`
type AboveOrBelowThresholdUserInputOptions = Record<
  'threshold' | 'thresholdDirection',
  string
>;

const isAboveOrBelowThresholdUserInputOptions = (
  userInputOptions: UserInputOptions,
): userInputOptions is AboveOrBelowThresholdUserInputOptions => {
  return !!userInputOptions.threshold && !!userInputOptions.thresholdDirection;
};

const sortAboveOrBelowThresholdUserInputOptionValue = (
  filterOptions: Record<'threshold' | 'thresholdDirection', string>,
  userInputParmValueMetadataMap: Map<string, InputParmValueMetadata>,
) => {
  const sortedFilterOptions = [];
  if (filterOptions.thresholdDirection) {
    const thresholdDirection =
      filterOptions.thresholdDirection[0].toUpperCase() +
      filterOptions.thresholdDirection.slice(1);
    sortedFilterOptions.push(thresholdDirection);
  }
  if (filterOptions.threshold) {
    const inputParamMetadata = userInputParmValueMetadataMap.get('threshold');
    if (inputParamMetadata) {
      const prefix = inputParamMetadata.prefixAndSuffix
        ? inputParamMetadata.prefixAndSuffix.prefix
        : derivePrefixAndSuffixFromValueType(inputParamMetadata.valueType)
            .prefix;
      const suffix = inputParamMetadata.prefixAndSuffix
        ? inputParamMetadata.prefixAndSuffix.suffix
        : derivePrefixAndSuffixFromValueType(inputParamMetadata.valueType)
            .suffix;
      const thresholdValue = convertOptionValue(
        filterOptions.threshold,
        inputParamMetadata.valueType,
        ConvertOptionDirection.BtoF,
      );
      sortedFilterOptions.push(`${prefix} ${thresholdValue} ${suffix}`);
    }
  }
  return sortedFilterOptions;
};
