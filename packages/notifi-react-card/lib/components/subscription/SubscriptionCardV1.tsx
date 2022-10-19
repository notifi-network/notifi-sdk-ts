import React, { useEffect, useRef } from 'react';

import { useNotifiSubscriptionContext } from '../../context';
import { CardConfigItemV1, useNotifiSubscribe } from '../../hooks';
import { DeepPartialReadonly } from '../../utils';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import {
  EditCardView,
  EditCardViewProps,
} from './subscription-card-views/EditCardView';
import {
  PreviewCard,
  PreviewCardProps,
} from './subscription-card-views/PreviewCard';

export type SubscriptionCardV1Props = Readonly<{
  classNames?: {
    PreviewCard?: DeepPartialReadonly<PreviewCardProps['classNames']>;
    EditCard?: DeepPartialReadonly<EditCardViewProps['classNames']>;
  };
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
  const { cardView, email, phoneNumber, telegramId, setCardView } =
    useNotifiSubscriptionContext();

  const { isInitialized } = useNotifiSubscribe();

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
      setCardView({ state: 'preview' });
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
          data={data}
          classNames={classNames?.EditCard}
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
