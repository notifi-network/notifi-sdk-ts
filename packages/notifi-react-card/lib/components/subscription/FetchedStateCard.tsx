import { FetchedState, useNotifiSubscribe } from '../../hooks';
import { SubscriptionCardUnsupported } from './SubscriptionCardUnsupported';
import { SubscriptionCardV1 } from './SubscriptionCardV1';
import React, { useCallback } from 'react';

type Props = Readonly<{
  card: FetchedState;
  inputs: Record<string, string | undefined>;
}>;

export const FetchedStateCard: React.FC<Props> = ({ card, inputs }) => {
  const { loading, isAuthenticated, isInitialized, logIn, subscribe } =
    useNotifiSubscribe();

  const inputDisabled = loading || !isAuthenticated || !isInitialized;

  const handleClick = useCallback(() => {
    if (isAuthenticated) {
      subscribe();
    } else {
      logIn();
    }
  }, [isAuthenticated, isInitialized, logIn, subscribe]);

  let contents: React.ReactNode = <SubscriptionCardUnsupported />;
  switch (card.data.version) {
    case 'v1':
      contents = (
        <SubscriptionCardV1
          data={card.data}
          inputs={inputs}
          inputDisabled={inputDisabled}
        />
      );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {contents}
      <button disabled={!isInitialized || loading} onClick={handleClick}>
        {isAuthenticated ? 'Subscribe' : 'Log in'}
      </button>
    </div>
  );
};
