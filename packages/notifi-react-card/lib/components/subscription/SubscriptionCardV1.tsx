import React, { useEffect, useRef } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import { AlertListProps } from './subscription-card-views/AlertListPreview';
import {
  EditCardView,
  EditCardViewProps,
} from './subscription-card-views/EditCardView';
import {
  AlertHistoryView,
  AlertHistoryViewProps,
} from './subscription-card-views/HistoryCardView';
import {
  PreviewCard,
  PreviewCardProps,
} from './subscription-card-views/PreviewCard';

export type SubscriptionCardV1Props = Readonly<{
  buttonText?: string;
  classNames?: {
    PreviewCard?: DeepPartialReadonly<PreviewCardProps['classNames']>;
    HistoryCard?: DeepPartialReadonly<AlertHistoryViewProps['classNames']>;
    EditCard?: DeepPartialReadonly<EditCardViewProps['classNames']>;
    AlertList?: DeepPartialReadonly<AlertListProps['classNames']>;
  };

  hideAlertListPreview?: boolean;
  inputDisabled: boolean;
  data: CardConfigItemV1;
  inputs: Record<string, string | undefined>;
  inputLabels?: NotifiInputLabels;
  inputSeparators?: NotifiInputSeparators;
}>;

export const SubscriptionCardV1: React.FC<SubscriptionCardV1Props> = ({
  buttonText,
  classNames,
  data,
  hideAlertListPreview,
  inputDisabled,
  inputs,
  inputLabels,
  inputSeparators,
}) => {
  const allowedCountryCodes = [...data.contactInfo.sms.supportedCountryCodes];
  const { cardView, email, phoneNumber, telegramId, setCardView } =
    useNotifiSubscriptionContext();

  const { isInitialized } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

  let view = null;

  const firstLoad = useRef(false);
  useEffect(() => {
    if (firstLoad.current || !isInitialized) {
      return;
    }

    firstLoad.current = true;

    if (
      (email !== '' && email !== undefined) ||
      (phoneNumber !== '' && phoneNumber !== undefined) ||
      (telegramId !== '' && telegramId !== undefined)
    ) {
      setCardView({ state: 'history' });
    } else {
      setCardView({ state: 'edit' });
    }
  }, [email, phoneNumber, telegramId, setCardView, cardView, isInitialized]);

  switch (cardView.state) {
    case 'preview':
      view = (
        <PreviewCard
          data={data}
          inputs={inputs}
          inputDisabled={inputDisabled}
          classNames={classNames?.PreviewCard}
        />
      );
      break;
    case 'edit':
      view = (
        <EditCardView
          hideAlertListPreview={hideAlertListPreview}
          buttonText={buttonText}
          data={data}
          classNames={classNames?.EditCard}
          inputDisabled={inputDisabled}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          allowedCountryCodes={allowedCountryCodes}
        />
      );
      break;
    case 'history':
      view = <AlertHistoryView />;
      break;
  }
  return <>{view}</>;
};
