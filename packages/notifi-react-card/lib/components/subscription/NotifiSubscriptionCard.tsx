import { useSubscriptionCard } from '../../hooks';
import { ErrorStateCard } from './ErrorStateCard';
import { FetchedStateCard } from './FetchedStateCard';
import { LoadingStateCard } from './LoadingStateCard';
import React from 'react';

export type Props = Readonly<{
  cardId: string;
  inputs?: Record<string, string | undefined>;
}>;

export const NotifiSubscriptionCard: React.FC<Props> = ({
  cardId,
  inputs = {},
}: Props) => {
  const card = useSubscriptionCard(cardId);
  switch (card.state) {
    case 'loading':
      return <LoadingStateCard card={card} />;
    case 'error':
      return <ErrorStateCard card={card} />;
    case 'fetched':
      return <FetchedStateCard card={card} inputs={inputs} />;
  }
};
