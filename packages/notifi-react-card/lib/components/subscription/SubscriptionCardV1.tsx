import React from 'react';

import { NotifiEmailInput, NotifiSmsInput, NotifiTelegramInput } from '..';
import { CardConfigItemV1 } from '../../hooks';
import { EventTypeBroadcastRow } from './EventTypeBroadcastRow';
import { EventTypeUnsupportedRow } from './EventTypeUnsupportedRow';

type Props = Readonly<{
  inputDisabled: boolean;
  data: CardConfigItemV1;
  inputs: Record<string, string | undefined>;
}>;

export const SubscriptionCardV1: React.FC<Props> = ({
  data,
  inputDisabled,
  inputs,
}) => {
  return (
    <>
      {data.contactInfo.email.active ? (
        <NotifiEmailInput disabled={inputDisabled} />
      ) : null}
      {data.contactInfo.sms.active ? (
        <NotifiSmsInput disabled={inputDisabled} />
      ) : null}
      {data.contactInfo.telegram.active ? (
        <NotifiTelegramInput disabled={inputDisabled} />
      ) : null}
      {data.eventTypes?.map((eventType) => {
        switch (eventType.type) {
          case 'broadcast':
            return (
              <EventTypeBroadcastRow
                key={eventType.name}
                disabled={inputDisabled}
                config={eventType}
                inputs={inputs}
              />
            );
          default:
            return <EventTypeUnsupportedRow key={JSON.stringify(eventType)} />;
        }
      })}
    </>
  );
};
