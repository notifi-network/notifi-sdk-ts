import { ErrorStateCard } from './ErrorStateCard';
import { FetchedStateCard } from './FetchedStateCard';
import { LoadingStateCard } from './LoadingStateCard';
import { useSubscriptionCard } from 'notifi-react-card/lib/hooks';
import React from 'react';

export type Props = Readonly<{
  cardId: string;
}>;

export const NotifiSubscriptionCard: React.FC<Props> = ({ cardId }: Props) => {
  const card = useSubscriptionCard(cardId);
  switch (card.state) {
    case 'loading':
      return <LoadingStateCard card={card} />;
    case 'error':
      return <ErrorStateCard card={card} />;
    case 'fetched':
      return <FetchedStateCard card={card} />;
  }
};
