import { FetchedState } from '../../hooks';
import { SubscriptionCardUnsupported } from './SubscriptionCardUnsupported';
import { SubscriptionCardV1 } from './SubscriptionCardV1';
import React from 'react';

type Props = Readonly<{
  card: FetchedState;
}>;

export const FetchedStateCard: React.FC<Props> = ({ card }) => {
  let contents: React.ReactNode = <SubscriptionCardUnsupported />;
  switch (card.data.version) {
    case 'v1':
      contents = <SubscriptionCardV1 data={card.data} />;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {contents}
    </div>
  );
};
