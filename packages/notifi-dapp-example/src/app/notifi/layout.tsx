'use client';

import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function NotifiSingupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallets, selectedWallet } = useWallets();

  const router = useRouter();
  useEffect(() => {
    if (!selectedWallet || !wallets[selectedWallet].walletKeys) {
      router.push('/');
    }
  }, [selectedWallet]);
  return <NotifiContextWrapper>{children}</NotifiContextWrapper>;
}
