import { ConnectedWallet } from '@notifi-network/notifi-core';
import React, { useCallback, useMemo } from 'react';

import { OwnedWalletParams, useNotifiClientContext } from '../../context';

export type ConnectWalletRowProps = OwnedWalletParams &
  Readonly<{
    connectedWallets: ReadonlyArray<ConnectedWallet>;
  }>;

export const ConnectWalletRow: React.FC<ConnectWalletRowProps> = ({
  connectedWallets,
  signMessageParams,
  walletPublicKey,
  accountId,
}: ConnectWalletRowProps) => {
  const { client } = useNotifiClientContext();
  const isConnected = useMemo(() => {
    return connectedWallets.some(
      (it) =>
        it.address === accountId &&
        it.walletBlockchain === signMessageParams.walletBlockchain,
    );
  }, [connectedWallets, accountId, signMessageParams.walletBlockchain]);

  const connectWallet = useCallback(async () => {
    await client.connectWallet({
      signMessageParams,
      accountId,
      walletPublicKey,
      connectWalletConflictResolutionTechnique: 'FAIL',
    });
  }, [client, signMessageParams, accountId, walletPublicKey]);

  if (isConnected) {
    return <div>{walletPublicKey} is connected</div>;
  }
  return (
    <div>
      {walletPublicKey}{' '}
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
