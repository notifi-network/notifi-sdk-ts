import React from 'react';

import { CardConfigItemV1 } from '../../../../hooks';
import {
  EventTypeBroadcastRow,
  EventTypeBroadcastRowProps,
} from '../../EventTypeBroadcastRow';
import {
  EventTypeDirectPushRow,
  EventTypeDirectPushRowProps,
} from '../../EventTypeDirectPushRow';
import {
  EventTypeHealthCheckRow,
  EventTypeHealthCheckRowProps,
} from '../../EventTypeHealthCheckRow';
import {
  EventTypeLabelRow,
  EventTypeLabelRowProps,
} from '../../EventTypeLabelRow';
import {
  EventTypeTradingPairsRow,
  EventTypeTradingPairsRowProps,
} from '../../EventTypeTradingPairsRow';
import {
  EventTypeUnsupportedRow,
  EventTypeUnsupportedRowProps,
} from '../../EventTypeUnsupportedRow';

export type AlertsPanelProps = Readonly<{
  data: CardConfigItemV1;
  inputDisabled: boolean;
  classNames?: Readonly<{
    EventTypeBroadcastRow?: EventTypeBroadcastRowProps['classNames'];
    EventTypeDirectPushRow?: EventTypeDirectPushRowProps['classNames'];
    EventTypeHealthCheckRow?: EventTypeHealthCheckRowProps['classNames'];
    EventTypeLabelRow?: EventTypeLabelRowProps['classNames'];
    EventTypeTradingPairsRow?: EventTypeTradingPairsRowProps['classNames'];
    EventTypeUnsupportedRow?: EventTypeUnsupportedRowProps['classNames'];
  }>;
  inputs: Record<string, unknown>;
}>;
export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  data,
  inputDisabled,
  classNames,
  inputs,
}) => {
  return (
    <div>
      {data.eventTypes?.map((eventType) => {
        switch (eventType.type) {
          case 'broadcast':
            return (
              <EventTypeBroadcastRow
                key={eventType.name}
                classNames={classNames?.EventTypeBroadcastRow}
                disabled={inputDisabled}
                config={eventType}
                inputs={inputs}
              />
            );
          case 'directPush':
            return (
              <EventTypeDirectPushRow
                key={eventType.name}
                classNames={classNames?.EventTypeDirectPushRow}
                disabled={inputDisabled}
                config={eventType}
                inputs={inputs}
              />
            );
          case 'healthCheck':
            return (
              <EventTypeHealthCheckRow
                key={eventType.name}
                classNames={classNames?.EventTypeHealthCheckRow}
                disabled={inputDisabled}
                config={eventType}
              />
            );
          case 'label':
            return (
              <EventTypeLabelRow
                key={eventType.name}
                classNames={classNames?.EventTypeLabelRow}
                config={eventType}
              />
            );
          case 'tradingPair':
            return (
              <EventTypeTradingPairsRow
                key={eventType.name}
                classNames={classNames?.EventTypeTradingPairsRow}
                config={eventType}
                inputs={inputs}
              />
            );
          default:
            return (
              <EventTypeUnsupportedRow
                key={JSON.stringify(eventType)}
                classNames={classNames?.EventTypeUnsupportedRow}
              />
            );
        }
      })}
    </div>
  );
};
