import React from 'react';

import type {
  NotifiEmailInputProps,
  NotifiSmsInputProps,
  NotifiTelegramInputProps,
} from '..';
import { CardConfigItemV1 } from '../../hooks';
import { useFetchedCardState } from '../../hooks/useFetchedCardState';
import type { EventTypeBroadcastRowProps } from './EventTypeBroadcastRow';
import type { EventTypeUnsupportedRowProps } from './EventTypeUnsupportedRow';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import { EditCardView } from './subscription card views/EditCardView';

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
  inputLabels?: NotifiInputLabels;
  inputSeparators?: NotifiInputSeparators;
}>;

export const SubscriptionCardV1: React.FC<SubscriptionCardV1Props> = ({
  classNames,
  data,
  inputDisabled,
  inputs,
  inputLabels,
  inputSeparators,
}) => {
  const allowedCountryCodes = [...data.contactInfo.sms.supportedCountryCodes];
  const { cardView } = useFetchedCardState();

  let view = null;

  switch (cardView.state) {
    case 'edit':
      view = (
        <EditCardView
          data={data}
          classNames={classNames}
          inputDisabled={inputDisabled}
          inputs={inputs}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          allowedCountryCodes={allowedCountryCodes}
        />
      );
      break;
  }
  return <>{view}</>;
};
