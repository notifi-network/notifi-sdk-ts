import React from 'react';

import { FetchedState } from '../../hooks';
import {
  NotifiInputFieldsText,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import { SubscriptionCardUnsupported } from './SubscriptionCardUnsupported';
import type { SubscriptionCardV1Props } from './SubscriptionCardV1';
import { SubscriptionCardV1 } from './SubscriptionCardV1';

export type FetchedStateCardProps = Readonly<{
  classNames?: Readonly<{
    SubscriptionCardV1?: SubscriptionCardV1Props['classNames'];
  }>;
  copy?: Readonly<{
    SubscriptionCardV1?: SubscriptionCardV1Props['copy'];
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
  }

  return <>{contents}</>;
};
