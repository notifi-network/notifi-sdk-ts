import React from 'react';

import { FetchedState } from '../../hooks/useIntercomCard';
import {
  NotifiInputLabels,
  NotifiInputSeparators,
} from '../subscription/NotifiSubscriptionCard';
import { SubscriptionCardUnsupported } from '../subscription/SubscriptionCardUnsupported';
import type { SubscriptionCardV1Props } from '../subscription/SubscriptionCardV1';

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

export const FetchedStateCard: React.FC<FetchedStateCardProps> = ({ card }) => {
  let contents: React.ReactNode = <SubscriptionCardUnsupported />;
  switch (card.data.hasStartedChatting) {
    case true:
      contents = <></>;
      break;
    case false:
      contents = <></>;
      break;
  }

  return <>{contents}</>;
};
