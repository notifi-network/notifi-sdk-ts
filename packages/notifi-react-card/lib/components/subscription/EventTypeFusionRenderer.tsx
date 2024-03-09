import { FusionMultiThreshholdEventTypeItem } from 'notifi-frontend-client/lib/models';
import {
  FusionHealthCheckEventTypeItem,
  FusionToggleEventTypeItem,
} from 'notifi-react-card/lib';
import { useNotifiSubscriptionContext } from 'notifi-react-card/lib/context';
import React from 'react';

import { EventTypeFusionHealthCheckRow } from './EventTypeFusionHealthCheckRow';
import { EventTypeFusionToggleRow } from './EventTypeFusionToggleRow';

type Filter = {
  name: string;
  type?: string; // Assuming type is optional
  description: string;
  userInputParams?: {
    kind: string;
    name: string;
    options: number[];
    description: string;
    allowCustomInput: boolean;
  }[];
  executionPriority?: number; // Assuming executionPriority is optional
  requiredParserVariables?: {
    variableName: string;
    variableType: string;
    variableDescription: string;
  }[];
};

export interface FusionRendererProps {
  classNames: any;
  disabled: any;
  config:
    | FusionToggleEventTypeItem
    | FusionHealthCheckEventTypeItem
    | FusionMultiThreshholdEventTypeItem;
  inputs: any;
}

export const EventTypeFusionRenderer: React.FC<FusionRendererProps> = ({
  classNames,
  disabled,
  config,
  inputs,
}) => {
  const { fusionEventDescriptors } = useNotifiSubscriptionContext();

  const filteredFusionEvents = fusionEventDescriptors.filter(
    (event) => event.name === config.name,
  );

  const metadataString = filteredFusionEvents[0]?.metadata;
  const parsedMetadata = JSON.parse(metadataString ?? '{"filter":[]}');

  if (parsedMetadata.filter.length === 0) {
    return (
      <EventTypeFusionToggleRow
        key={config.name}
        classNames={classNames?.EventTypeFusionToggleRow}
        disabled={disabled}
        config={config as FusionToggleEventTypeItem}
        inputs={inputs}
      />
    );
  } else {


      const newMetadata: FusionHealthCheckEventTypeItem = {
        name: config.name,
        type: 'fusion',
        fusionEventId: config.fusionEventId,
        sourceAddress: config.sourceAddress,
        selectedUIType: 'HEALTH_CHECK',
        healthCheckSubtitle: parsedMetadata.filter[0].description,
        numberType: parsedMetadata.filter[0].userInputParams[0].kind,
        checkRatios: CheckRatio[],
        alertFrequency: 'DAILY'
      }
   
    

    return (
      <EventTypeFusionHealthCheckRow
        key={config.name}
        disabled={disabled}
        config={config as FusionHealthCheckEventTypeItem}
        classNames={classNames?.EventTypeFusionHealthCheckRow}
        inputs={inputs}
      />
    );
  }
};
