import {
  EventTypeItem,
  FusionEventTypeItem,
} from '@notifi-network/notifi-frontend-client';
import clsx from 'clsx';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { DeleteIcon } from '../../assets/DeleteIcon';
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import {
  FusionHealthCheckEventTypeItem,
  FusionMultiThresholdEventTypeItem,
  FusionToggleEventTypeItem,
  SubscriptionData,
  useNotifiSubscribe,
} from '../../hooks';
import {
  DeepPartialReadonly,
  fusionHealthCheckConfiguration,
  subscribeAlertByFrontendClient,
  unsubscribeAlertByFrontendClient,
} from '../../utils';
import {
  EventTypeFusionHealthCheckRow,
  EventTypeFusionHealthCheckRowProps,
} from './EventTypeFusionHealthCheckRow';
import {
  EventTypeFusionMultiThresholdRow,
  EventTypeFusionMultiThresholdRowProps,
} from './EventTypeFusionMultiThresholdRow';
import {
  EventTypeFusionRowProps,
  EventTypeFusionToggleRow,
} from './EventTypeFusionToggleRow';
import { NotifiTooltip, NotifiTooltipProps } from './NotifiTooltip';
import { resolveStringRef } from './resolveRef';

type FilterType = {
  name: 'belowThreshold' | 'aboveThreshold';
  type: 'AlertFilter';
  description: string;
  userInputParams: Array<{
    kind: 'integer' | 'percentage' | 'price';
    name: string;
    options: number[];
    description: string;
    allowCustomInput: boolean;
  }>;
  executionPriority: number;
  requiredParserVariables: Array<{
    variableName: string;
    variableType: 'integer';
    variableDescription: string;
  }>;
};

type AlertFrequency =
  | {
      name: 'frequency';
      description: 'This is the minimum time delay set between alerts emitted';
      minimumDurationBetweenTriggersInMinutes: number;
    }
  | undefined;

type AlertFilter = [FilterType, AlertFrequency];

type EventTypeRendererConfig =
  | FusionToggleEventTypeItem
  | FusionHealthCheckEventTypeItem
  | FusionMultiThresholdEventTypeItem;

type EventTypeRendererClassNames =
  | EventTypeFusionRowProps['classNames']
  | EventTypeFusionHealthCheckRowProps['classNames']
  | EventTypeFusionMultiThresholdRowProps['classNames'];

export type EventTypeFusionRendererProps = Readonly<{
  disabled: boolean;
  classNames?: EventTypeRendererClassNames;
  config: EventTypeRendererConfig;
  inputs: Record<string, unknown>;
}>;

const renderEventTypeComponent = (
  config: EventTypeRendererConfig,
  classNames: EventTypeRendererClassNames,
  disabled: boolean,
  inputs: Record<string, unknown>,
) => {
  switch (config.selectedUIType) {
    case 'HEALTH_CHECK':
      return (
        <EventTypeFusionHealthCheckRow
          key={config.name}
          disabled={disabled}
          config={config}
          classNames={classNames?.EventTypeFusionHealthCheckRow}
          inputs={inputs}
        />
      );
    case 'TOGGLE':
      return (
        <EventTypeFusionToggleRow
          key={config.name}
          classNames={classNames?.EventTypeFusionToggleRow}
          disabled={disabled}
          config={config}
          inputs={inputs}
        />
      );
    case 'MULTI_THRESHOLD':
      return (
        <EventTypeFusionMultiThresholdRow
          key={config.name}
          classNames={classNames?.EventTypeFusionMultiThresholdRow}
          config={config}
          inputs={inputs}
        />
      );
  }
};

export const EventTypeFusionRenderer: React.FC<
  EventTypeFusionRendererProps
> = ({
  classNames,
  config,
  inputs,
  disabled,
}: EventTypeFusionRendererProps) => {
  const { fusionEventDescriptors } = useNotifiSubscriptionContext();

  if (fusionEventDescriptors === null) {
    renderEventTypeComponent(config, classNames, disabled, inputs);
  }

  const filteredFusionEvents = fusionEventDescriptors?.filter(
    (event) => event.name === config.name,
  );

  if (filteredFusionEvents?.[0]?.metadata === undefined) {
    throw new Error(
      'Metadata is undefined, impossible to be a real fusionEvent',
    );
  }

  const metadata: AlertFilter = JSON.parse(filteredFusionEvents?.[0]?.metadata);

  if (Array.isArray(metadata.filter) && metadata.filter.length === 0) {
    renderEventTypeComponent(config, classNames, disabled, inputs);
  } else {
    switch (metadata[0].name) {
      case 'belowThreshold':
        const convertedConfigItem = convertHealthCheckRowFor;
        return (
          <EventTypeFusionHealthCheckRow
            key={config.name}
            disabled={disabled}
            config={config}
            classNames={classNames?.EventTypeFusionHealthCheckRow}
            inputs={inputs}
          />
        );
      case 'aboveThreshold':
        return (
          <EventTypeFusionHealthCheckRow
            key={config.name}
            disabled={disabled}
            config={config}
            classNames={classNames?.EventTypeFusionHealthCheckRow}
            inputs={inputs}
          />
        );
    }
  }

  return <div></div>;
};
