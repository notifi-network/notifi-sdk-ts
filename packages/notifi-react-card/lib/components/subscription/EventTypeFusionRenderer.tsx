import { FusionMultiThreshholdEventTypeItem } from 'notifi-frontend-client/lib/models';
import {
  EventTypeBroadcastRowProps,
  EventTypeConfig,
  EventTypeCustomHealthCheckRowProps,
  EventTypeDirectPushRowProps,
  EventTypeFusionMultiThresholdRowProps,
  EventTypeHealthCheckRowProps,
  EventTypeItem,
  EventTypeLabelRowProps,
  EventTypePriceChangeRowProps,
  EventTypeTradingPairsRowProps,
  EventTypeUnsupportedRowProps,
  EventTypeWalletBalanceRowProps,
  FusionHealthCheckEventTypeItem,
  FusionToggleEventTypeItem,
} from 'notifi-react-card/lib';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import React from 'react';

import { EventTypeFusionHealthCheckRow, EventTypeFusionHealthCheckRowProps } from './EventTypeFusionHealthCheckRow';
import { EventTypeFusionRowProps, EventTypeFusionToggleRow } from './EventTypeFusionToggleRow';
import { EventTypeXMPTRowProps } from './EventTypeXMTPRow';
import { minutesConvertToFrequency } from 'notifi-react-card/lib/utils/datetimeUtils';

export interface FusionRendererProps {

  disabled: boolean;
  config:
  FusionToggleEventTypeItem | FusionHealthCheckEventTypeItem | FusionMultiThreshholdEventTypeItem;
  inputs:  Record<string, unknown>;
}

const classNames: {
  EventTypeFusionToggleRow: EventTypeFusionRowProps['classNames'],
  EventTypeFusionHealthCheckRow: EventTypeFusionHealthCheckRowProps['classNames'],
  EventTypeFusionMultiThresholdRowProps: EventTypeFusionMultiThresholdRowProps['classNames']
};


export const EventTypeFusionRenderer: React.FC<FusionRendererProps> = ({
  disabled,
  config,
  inputs,
}) => {
  const { fusionEventDescriptors } = useNotifiSubscriptionContext();

  const filteredFusionEvents = fusionEventDescriptors.filter(
    (event) => event.name === config.name,
  );

  const metadataString = filteredFusionEvents[0]?.metadata;

  if (metadataString === undefined) {
    console.log('Metadata is undefined, cannot render Fusion Event Toggle')
    return null
  }

  if (filteredFusionEvents[0]?.metadata === '{"filter":[]}'){
    return (
      <EventTypeFusionToggleRow
        key={config.name}
        classNames={classNames.EventTypeFusionToggleRow}
        disabled={disabled}
        config={config as FusionToggleEventTypeItem}
        inputs={inputs}
      />
    );

  }

  else {

    const parsedMetadata = JSON.parse(metadataString);

      const newMetadata: FusionHealthCheckEventTypeItem = {
        name: config.name,
        type: 'fusion',
        fusionEventId: config.fusionEventId,
        sourceAddress: config.sourceAddress,
        selectedUIType: 'HEALTH_CHECK',
        healthCheckSubtitle: parsedMetadata.filter[0].description,
        numberType: parsedMetadata.filter[0].userInputParams[0].kind,
        checkRatios: CheckRatio[],
        alertFrequency: minutesConvertToFrequency(parsedMetadata.filter[1].minimumDurationBetweenTriggersInMinutes) ?? 'ALWAYS',
      }

    return (
      <EventTypeFusionHealthCheckRow
        key={config.name}
        disabled={disabled}
        config={config as FusionHealthCheckEventTypeItem }
        classNames={classNames.EventTypeFusionHealthCheckRow}
        inputs={inputs}
      />
    );
  }
};
