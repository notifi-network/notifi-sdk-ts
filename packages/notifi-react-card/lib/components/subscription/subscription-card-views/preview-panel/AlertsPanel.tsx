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
  EventTypeLabelRow,
  EventTypeLabelRowProps,
} from '../../EventTypeLabelRow';
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
    EventTypeLabelRow?: EventTypeLabelRowProps['classNames'];
    EventTypeUnsupportedRow?: EventTypeUnsupportedRowProps['classNames'];
  }>;
  inputs: Record<string, string | undefined>;
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
          case 'label':
            return (
              <EventTypeLabelRow
                key={eventType.name}
                classNames={classNames?.EventTypeLabelRow}
                config={eventType}
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
