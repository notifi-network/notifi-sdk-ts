import { LoadingState } from '../../hooks';
import React from 'react';

type Props = Readonly<{
  card: LoadingState;
}>;

export const LoadingStateCard: React.FC<Props> = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          background: '#fee',
          borderRadius: 8,
        }}
      />
      <div
        style={{
          background: '#fee',
          borderRadius: 8,
        }}
      />
      <div
        style={{
          background: '#fee',
          borderRadius: 8,
        }}
      />
    </div>
  );
};
