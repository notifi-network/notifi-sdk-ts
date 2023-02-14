import {
  ConnectedWallet,
  WalletWithSignParams,
} from '@notifi-network/notifi-core';
import { addressEllipsis } from 'notifi-react-card/lib/utils/stringUtils';
import React, { useCallback, useMemo } from 'react';

import { useNotifiSubscribe } from '../../hooks';

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
  const { subscribeWallet } = useNotifiSubscribe({
    targetGroupName: 'Default',
  });

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

  const shortenedAddress = useMemo(() => {
    if (walletParams === null || walletParams.walletPublicKey === null) {
      return null;
    }
    return addressEllipsis(walletParams.walletPublicKey);
  }, [walletParams]);

  const connectWallet = useCallback(async () => {
    await subscribeWallet({
      walletParams,
      connectWalletConflictResolutionTechnique: 'FAIL',
    });
  }, [subscribeWallet, walletParams]);

  if (isConnected) {
    return (
      <div className="NotifiVerifyItem">
        <p className="NotifiVerifyPublicKey">{shortenedAddress}</p>
      </div>
    );
  }
  return (
    <div className="NotifiVerifyItem">
      <p className="NotifiVerifyPublicKey">{shortenedAddress}</p>
      <button
        className="NotifiVerifyButton"
        onClick={() => {
          connectWallet();
        }}
      >
        Connect
      </button>
    </div>
  );
};
