import React from 'react';

import { CardConfigItemV1 } from '../../../../hooks';
import {
  EventTypeBroadcastRow,
  EventTypeBroadcastRowProps,
} from '../../EventTypeBroadcastRow';
import { EventTypeDirectPushRow } from '../../EventTypeDirectPushRow';
import {
  EventTypeUnsupportedRow,
  EventTypeUnsupportedRowProps,
} from '../../EventTypeUnsupportedRow';

export type AlertsPanelProps = Readonly<{
  data: CardConfigItemV1;
  inputDisabled: boolean;
  classNames?: Readonly<{
    EventTypeBroadcastRow?: EventTypeBroadcastRowProps['classNames'];
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
                classNames={classNames?.EventTypeBroadcastRow}
                disabled={inputDisabled}
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
