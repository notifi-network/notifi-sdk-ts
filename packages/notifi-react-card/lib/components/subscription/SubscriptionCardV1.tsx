import React from 'react';

import type {
  NotifiEmailInputProps,
  NotifiSmsInputProps,
  NotifiTelegramInputProps,
} from '..';
import { useNotifiSubscriptionContext } from '../../context';
import { CardConfigItemV1 } from '../../hooks';
import type { EventTypeBroadcastRowProps } from './EventTypeBroadcastRow';
import type { EventTypeUnsupportedRowProps } from './EventTypeUnsupportedRow';
import { NotifiSubscribeButtonProps } from './NotifiSubscribeButton';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import { EditCardView } from './subscription-card-views/EditCardView';
import { PreviewCard } from './subscription-card-views/PreviewCard';

export type SubscriptionCardV1Props = Readonly<{
  classNames?: PreviewCardClassNamesProps &
    NotifiInputProps &
    Readonly<{
      NotifiSubscribeButton?: NotifiSubscribeButtonProps['classNames'];
    }>;
  inputDisabled: boolean;
  data: CardConfigItemV1;
  inputs: Record<string, string | undefined>;
  inputLabels?: NotifiInputLabels;
  inputSeparators?: NotifiInputSeparators;
}>;

export type NotifiInputProps = Readonly<{
  NotifiEmailInput?: NotifiEmailInputProps['classNames'];
  NotifiSmsInput?: NotifiSmsInputProps['classNames'];
  NotifiTelegramInput?: NotifiTelegramInputProps['classNames'];
}>;

export type PreviewCardClassNamesProps = Readonly<{
  NotifiPreviewCardSeparator?: string;
  EventTypeBroadcastRow?: EventTypeBroadcastRowProps['classNames'];
  EventTypeUnsupportedRow?: EventTypeUnsupportedRowProps['classNames'];
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
  const { cardView } = useNotifiSubscriptionContext();

  const previewCardClassNames: PreviewCardClassNamesProps = {
    EventTypeBroadcastRow: classNames?.EventTypeBroadcastRow,
    EventTypeUnsupportedRow: classNames?.EventTypeUnsupportedRow,
    NotifiPreviewCardSeparator: classNames?.NotifiPreviewCardSeparator,
  };

  let view = null;

  switch (cardView.state) {
    case 'preview':
      view = (
        <PreviewCard
          data={data}
          inputs={inputs}
          inputDisabled={inputDisabled}
          classNames={previewCardClassNames}
        />
      );
      break;
    case 'edit':
      view = (
        <EditCardView
          data={data}
          classNames={classNames}
          inputDisabled={inputDisabled}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          allowedCountryCodes={allowedCountryCodes}
        />
      );
      break;
  }
  return <>{view}</>;
};
