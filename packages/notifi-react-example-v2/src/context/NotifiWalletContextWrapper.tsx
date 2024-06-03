'use client';

import { NotifiWalletProvider } from '@notifi-network/notifi-wallet-provider';

export const NotifiWalletContextWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <NotifiWalletProvider>{children}</NotifiWalletProvider>;
};
