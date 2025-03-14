import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import * as walletAdapterWallets from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import React from 'react';

const network = clusterApiUrl('mainnet-beta');
const wallets = [
  new walletAdapterWallets.PhantomWalletAdapter(),
  new walletAdapterWallets.SolflareWalletAdapter(),
  new walletAdapterWallets.LedgerWalletAdapter(),
  new walletAdapterWallets.SolletWalletAdapter(),
  new walletAdapterWallets.SolletExtensionWalletAdapter(),
  new walletAdapterWallets.TorusWalletAdapter(),
  new walletAdapterWallets.SlopeWalletAdapter(),
];

export const SolanaContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets}>{children}</WalletProvider>
    </ConnectionProvider>
  );
};
