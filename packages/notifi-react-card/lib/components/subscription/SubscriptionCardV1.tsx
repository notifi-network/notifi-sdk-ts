import React from 'react';

import type {
  NotifiEmailInputProps,
  NotifiSmsInputProps,
  NotifiTelegramInputProps,
} from '..';
import { NotifiEmailInput, NotifiSmsInput, NotifiTelegramInput } from '..';
import { CardConfigItemV1 } from '../../hooks';
import type { EventTypeBroadcastRowProps } from './EventTypeBroadcastRow';
import { EventTypeBroadcastRow } from './EventTypeBroadcastRow';
import { EventTypeDirectPushRow } from './EventTypeDirectPushRow';
import type { EventTypeUnsupportedRowProps } from './EventTypeUnsupportedRow';
import { EventTypeUnsupportedRow } from './EventTypeUnsupportedRow';

export type SubscriptionCardV1Props = Readonly<{
  classNames?: Readonly<{
    NotifiEmailInput?: NotifiEmailInputProps['classNames'];
    NotifiSmsInput?: NotifiSmsInputProps['classNames'];
    NotifiTelegramInput?: NotifiTelegramInputProps['classNames'];
    EventTypeBroadcastRow?: EventTypeBroadcastRowProps['classNames'];
    EventTypeUnsupportedRow?: EventTypeUnsupportedRowProps['classNames'];
  }>;
  inputDisabled: boolean;
  data: CardConfigItemV1;
  inputs: Record<string, string | undefined>;
  inputLabels?: {
    email?: string;
    sms?: string;
    telegram?: string;
  };
}>;

export const SubscriptionCardV1: React.FC<SubscriptionCardV1Props> = ({
  classNames,
  data,
  inputDisabled,
  inputs,
  inputLabels,
}) => {
  const allowedCountryCodes = [...data.contactInfo.sms.supportedCountryCodes];

  return (
    <>
      {data.contactInfo.email.active ? (
        <NotifiEmailInput
          disabled={inputDisabled}
          classNames={classNames?.NotifiEmailInput}
          copy={{ label: inputLabels?.email }}
        />
      ) : null}
      {data.contactInfo.sms.active ? (
        <NotifiSmsInput
          disabled={inputDisabled}
          classNames={classNames?.NotifiSmsInput}
          allowedCountryCodes={allowedCountryCodes}
          copy={{ label: inputLabels?.sms }}
        />
      ) : null}
      {data.contactInfo.telegram.active ? (
        <NotifiTelegramInput
          disabled={inputDisabled}
          classNames={classNames?.NotifiTelegramInput}
          copy={{ label: inputLabels?.telegram }}
        />
      ) : null}
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
    </>
  );
};
