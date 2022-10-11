import React from 'react';

import { FetchedState } from '../../hooks';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from './NotifiSubscriptionCard';
import { SubscriptionCardUnsupported } from './SubscriptionCardUnsupported';
import type { SubscriptionCardV1Props } from './SubscriptionCardV1';
import { SubscriptionCardV1 } from './SubscriptionCardV1';

export type FetchedStateCardProps = Readonly<{
  classNames?: Readonly<{
    SubscriptionCardV1?: SubscriptionCardV1Props['classNames'];
  }>;
  card: FetchedState;
  inputDisabled: boolean;
  inputs: Record<string, string | undefined>;
  inputLabels?: NotifiInputLabels;
  inputSeparators?: NotifiInputSeparators;
}>;

export const FetchedStateCard: React.FC<FetchedStateCardProps> = ({
  inputDisabled,
  classNames,
  card,
  inputs,
  inputLabels,
  inputSeparators,
}) => {
  let contents: React.ReactNode = <SubscriptionCardUnsupported />;
  switch (card.data.version) {
    case 'v1':
      contents = (
        <SubscriptionCardV1
          classNames={classNames?.SubscriptionCardV1}
          data={card.data}
          inputs={inputs}
          inputDisabled={inputDisabled}
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
        />
      );
  }

  return <>{contents}</>;
};
