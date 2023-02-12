import {
  ConnectedWallet,
  WalletWithSignParams,
} from '@notifi-network/notifi-core';
import React, { useCallback, useMemo } from 'react';

import { useNotifiClientContext } from '../../context';

export type ConnectWalletRowProps = WalletWithSignParams &
  Readonly<{
    connectedWallets: ReadonlyArray<ConnectedWallet>;
  }>;

const hasKey = <T,>(obj: T, prop: PropertyKey): prop is keyof T => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Object.prototype.hasOwnProperty.call(obj, prop)
  );
};

export const ConnectWalletRow: React.FC<ConnectWalletRowProps> = ({
  connectedWallets,
  ...walletParams
}: ConnectWalletRowProps) => {
  const { client } = useNotifiClientContext();

  const isConnected = useMemo(() => {
    const key = 'accountAddress';
    const address = hasKey(walletParams, key)
      ? walletParams[key]
      : walletParams.walletPublicKey;
    return connectedWallets.some(
      (it) =>
        it.address === address &&
        it.walletBlockchain === walletParams.walletBlockchain,
    );
  }, [connectedWallets, walletParams]);

  const connectWallet = useCallback(async () => {
    await client.connectWallet({
      walletParams,
      connectWalletConflictResolutionTechnique: 'FAIL',
    });
  }, [client, walletParams]);

  if (isConnected) {
    return <div>{walletParams.walletPublicKey} is connected</div>;
  }
  return (
    <div>
      {walletParams.walletPublicKey}{' '}
      <button
        onClick={() => {
          connectWallet();
        }}
      >
        Connect
      </button>
    </div>
  );
};
