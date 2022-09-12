import { ErrorState } from '../../hooks';
import React from 'react';

type Props = Readonly<{
  card: ErrorState;
}>;

export const ErrorStateCard: React.FC<Props> = ({ card }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div>Something went wrong.</div>
      <div>{card.reason}</div>
    </div>
  );
};
