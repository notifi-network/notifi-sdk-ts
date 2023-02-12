import {
  ConnectedWallet,
  WalletWithSignParams,
} from '@notifi-network/notifi-core';
import React from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../../context';
import { ConnectWalletRow } from './ConnectWalletRow';

export type WalletListInternalProps = Readonly<{
  connectedWallets: ReadonlyArray<ConnectedWallet>;
  ownedWallets: ReadonlyArray<WalletWithSignParams>;
}>;

export const WalletListInternal: React.FC<WalletListInternalProps> = ({
  connectedWallets,
  ownedWallets,
}: WalletListInternalProps) => {
  return (
    <ul>
      {ownedWallets.map((wallet) => {
        return (
          <ConnectWalletRow
            key={wallet.walletPublicKey}
            {...wallet}
            connectedWallets={connectedWallets}
          />
        );
      })}
    </ul>
  );
};

export const WalletList: React.FC = () => {
  const {
    params: { multiWallet },
  } = useNotifiClientContext();
  const { connectedWallets } = useNotifiSubscriptionContext();
  const owned = multiWallet?.ownedWallets;
  if (owned === undefined || owned.length === 0) {
    return null;
  }

  return (
    <WalletListInternal
      ownedWallets={owned}
      connectedWallets={connectedWallets}
    />
  );
};
