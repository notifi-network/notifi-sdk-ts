import { NotifiContext } from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  WalletConnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import React, { PropsWithChildren, useMemo } from 'react';

export const SolanaNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;
  const hwLoginPlugin = useMemo(() => {
    return new MemoProgramHardwareLoginPlugin({
      walletPublicKey: publicKey ?? '',
      connection,
      sendTransaction,
    });
  }, [publicKey, connection, sendTransaction]);

  return (
    <div className="container">
      {publicKey && signMessage ? (
        <NotifiContext
          dappAddress="colorfullife"
          walletBlockchain="SOLANA"
          env="Development"
          walletPublicKey={publicKey}
          hardwareLoginPlugin={hwLoginPlugin}
          signMessage={signMessage}
        >
          <WalletConnectButton />
          {children}
        </NotifiContext>
      ) : (
        <WalletMultiButton />
      )}
    </div>
  );
};
