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
  disabled: boolean;
}>;

export const WalletListInternal: React.FC<WalletListInternalProps> = ({
  connectedWallets,
  ownedWallets,
  disabled,
}: WalletListInternalProps) => {
  const { demoPreview } = useNotifiSubscriptionContext();
  return (
    <ul>
      {!demoPreview ? (
        ownedWallets.map((wallet) => {
          return (
            <ConnectWalletRow
              key={wallet.walletPublicKey}
              {...wallet}
              connectedWallets={connectedWallets}
              disabled={disabled}
            />
          );
        })
      ) : (
        <ConnectWalletRow
          key="Demo view"
          walletBlockchain="SOLANA"
          walletPublicKey="0x0notifi"
          signMessage={async (msg) => msg}
          connectedWallets={connectedWallets}
          disabled={disabled}
        />
      )}
    </ul>
  );
};
export const WalletList: React.FC = () => {
  const { demoPreview } = useNotifiSubscriptionContext();
  const clientContext = demoPreview ? null : useNotifiClientContext();
  const { connectedWallets, loading } = useNotifiSubscriptionContext();
  const owned = clientContext?.params.multiWallet?.ownedWallets;

  return (
    <WalletListInternal
      ownedWallets={owned ?? []}
      connectedWallets={connectedWallets}
      disabled={loading}
    />
  );
};
