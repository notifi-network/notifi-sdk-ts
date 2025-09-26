import { Icon } from '@/assets/Icon';
import {
  UserInputOptions,
  ValueType,
} from '@notifi-network/notifi-frontend-client';
import {
  ConvertOptionDirection,
  TopicStackAlert,
  convertOptionValue,
  derivePrefixAndSuffixFromValueType,
  getFusionEventMetadata,
  isAlertFilter,
  resolveAlertName,
  useNotifiTenantConfigContext,
  useNotifiTopicContext,
} from '@notifi-network/notifi-react';
import React from 'react';

export type TopicStackProps = {
  topicStackAlerts: TopicStackAlert[];
};

type InputParmValueMetadata = {
  valueType: ValueType;
  prefixAndSuffix: {
    prefix: string;
    suffix: string;
  } | null;
};

export const TopicStack: React.FC<TopicStackProps> = (props) => {
  const { getAlertFilterOptions, unsubscribeAlerts } = useNotifiTopicContext();
  const { getFusionTopic } = useNotifiTenantConfigContext();
  const benchmarkAlert = props.topicStackAlerts[0];
  const userInputOptions = React.useMemo(() => {
    const input = getAlertFilterOptions(benchmarkAlert.alertName)?.input;
    if (!input) return;
    return Object.values(input)[0];
  }, [getAlertFilterOptions]);

  const { isLoading } = useNotifiTopicContext();
  const resolved = resolveAlertName(benchmarkAlert.alertName);
  const fusionTopic = getFusionTopic(resolved.fusionEventTypeId);
  if (!fusionTopic) return null;
  const fusionEventMetadata = getFusionEventMetadata(fusionTopic);
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
    <div className="flex flex-row justify-between items-center py-3 border-b border-notifi-card-border">
      <div className="flex flex-col items-start">
        <div className="text-sm font-regular text-notifi-text">
          {benchmarkAlert.subscriptionValueInfo.label}
        </div>
        <div className="flex flex-row text-xs font-regular text-notifi-text-light">
          {userInputOptionValuesToBeDisplayed.map((option, id) => (
            <div key={id} className="mr-1 mt-1">
              {option}
            </div>
          ))}
        </div>
      </div>

      <div
        onClick={async () => {
          if (isLoading) return;
          const alerts = props.topicStackAlerts.map((alert) => alert.alertName);
          if (alerts.length === 0) return;
          await unsubscribeAlerts(alerts);
        }}
      >
        <Icon
          id="trash-btn"
          className="text-notifi-text-light top-6 left-4 cursor-pointer"
        />
      </div>
    </div>
  );
};

// Utils

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
      sortedFilterOptions.push(`${prefix}${thresholdValue}${suffix}`);
    }
  }
  return sortedFilterOptions;
};
