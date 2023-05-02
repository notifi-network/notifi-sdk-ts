import { CardConfigItemV1 } from '@notifi-network/notifi-frontend-client';
import React from 'react';

import {
  EventTypeBroadcastRow,
  EventTypeBroadcastRowProps,
} from '../../EventTypeBroadcastRow';
import {
  EventTypeCustomHealthCheckRow,
  EventTypeCustomHealthCheckRowProps,
} from '../../EventTypeCustomHealthCheckRow';
import { EventTypeCustomToggleRow } from '../../EventTypeCustomToggleRow';
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
  EventTypePriceChangeRow,
  EventTypePriceChangeRowProps,
} from '../../EventTypePriceChangeRow';
import {
  EventTypeTradingPairsRow,
  EventTypeTradingPairsRowProps,
} from '../../EventTypeTradingPairsRow';
import {
  EventTypeUnsupportedRow,
  EventTypeUnsupportedRowProps,
} from '../../EventTypeUnsupportedRow';
import {
  EventTypeWalletBalanceRow,
  EventTypeWalletBalanceRowProps,
} from '../../EventTypeWalletBalanceRow';
import {
  EventTypeXMPTRowProps,
  EventTypeXMTPRow,
} from '../../EventTypeXMTPRow';

export type AlertsPanelProps = Readonly<{
  data: CardConfigItemV1;
  inputDisabled: boolean;
  classNames?: Readonly<{
    EventTypeContainer?: string;
    EventTypeBroadcastRow?: EventTypeBroadcastRowProps['classNames'];
    EventTypeCustomHealthCheckRow?: EventTypeCustomHealthCheckRowProps['classNames'];
    EventTypeDirectPushRow?: EventTypeDirectPushRowProps['classNames'];
    EventTypeHealthCheckRow?: EventTypeHealthCheckRowProps['classNames'];
    EventTypeLabelRow?: EventTypeLabelRowProps['classNames'];
    EventTypePriceChangeRow?: EventTypePriceChangeRowProps['classNames'];
    EventTypeTradingPairsRow?: EventTypeTradingPairsRowProps['classNames'];
    EventTypeUnsupportedRow?: EventTypeUnsupportedRowProps['classNames'];
    EventTypeWalletBalanceRow?: EventTypeWalletBalanceRowProps['classNames'];
    EventTypeXMTPRow?: EventTypeXMPTRowProps['classNames'];
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
    <div className="NotifiEventTypeContainer">
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
          case 'custom': {
            return eventType.selectedUIType === 'HEALTH_CHECK' ? (
              <EventTypeCustomHealthCheckRow
                key={eventType.name}
                classNames={classNames?.EventTypeCustomHealthCheckRow}
                disabled={inputDisabled}
                config={eventType}
                inputs={inputs}
              />
            ) : (
              <EventTypeCustomToggleRow
                key={eventType.name}
                disabled={inputDisabled}
                config={eventType}
                classNames={classNames?.EventTypeCustomHealthCheckRow}
                inputs={inputs}
              />
            );
          }
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

          case 'XMTP':
            return (
              <EventTypeXMTPRow
                key={eventType.name}
                classNames={classNames?.EventTypeXMTPRow}
                disabled={inputDisabled}
                config={eventType}
                inputs={inputs}
              />
            );
          // TODO: Enable after MVP-2558 is merged
          // case 'healthCheck':
          //   return (
          //     <EventTypeHealthCheckRow
          //       key={eventType.name}
          //       classNames={classNames?.EventTypeHealthCheckRow}
          //       disabled={inputDisabled}
          //       config={eventType}
          //     />
          //   );
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
          case 'walletBalance':
            return (
              <EventTypeWalletBalanceRow
                key={eventType.name}
                classNames={classNames?.EventTypeWalletBalanceRow}
                disabled={inputDisabled}
                config={eventType}
                inputs={inputs}
              />
            );
          case 'priceChange':
            return (
              <EventTypePriceChangeRow
                key={eventType.name}
                classNames={classNames?.EventTypePriceChangeRow}
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
