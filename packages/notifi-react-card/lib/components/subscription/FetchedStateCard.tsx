import React from 'react';

import { FetchedState } from '../../hooks';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import { SubscriptionCardUnsupported } from './SubscriptionCardUnsupported';
import type { SubscriptionCardV1Props } from './SubscriptionCardV1';
import { SubscriptionCardV1 } from './SubscriptionCardV1';
import {
  SubscriptionCardV2,
  SubscriptionCardV2Props,
} from './v2/SubscriptionCardV2';

export type FetchedStateCardProps = Readonly<{
  classNames?: Readonly<{
    // TODO: MVP-3655
    SubscriptionCardV1?: SubscriptionCardV1Props['classNames'];
  }>;
  copy?: Readonly<{
    SubscriptionCardV1?: SubscriptionCardV1Props['copy'];
    SubscriptionCardV2?: SubscriptionCardV2Props['copy'];
  }>;
  card: FetchedState;
  inputDisabled: boolean;
  inputs: Record<string, unknown>;
  inputLabels?: NotifiInputFieldsText;
  inputSeparators?: NotifiInputSeparators;
  onClose?: () => void;
}>;

export const FetchedStateCard: React.FC<FetchedStateCardProps> = ({
  inputDisabled,
  classNames,
  copy,
  card,
  inputs,
  inputLabels,
  inputSeparators,
  onClose,
}) => {
  let contents: React.ReactNode = <SubscriptionCardUnsupported />;
  switch (card.data.version) {
    case 'v1':
      contents = (
        <SubscriptionCardV1
          classNames={classNames?.SubscriptionCardV1}
          copy={copy?.SubscriptionCardV1}
          data={card.data}
          inputs={inputs}
          inputDisabled={inputDisabled}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          onClose={onClose}
        />
      );
      break;
    case 'v2':
      contents = (
        <SubscriptionCardV2
          // TODO: MVP-3655
          classNames={classNames?.SubscriptionCardV1}
          // TODO: MVP-3655
          copy={copy?.SubscriptionCardV2}
          data={card.data}
          inputs={inputs}
          inputDisabled={inputDisabled}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          onClose={onClose}
        />
      );
      break;
  }

  return <>{contents}</>;
};
