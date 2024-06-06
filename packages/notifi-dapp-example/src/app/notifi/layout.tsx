'use client';

import { useInjectiveWallets } from '@/context/InjectiveWalletContext';
import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function NotifiSingupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const { wallets, selectedWallet } = useWallets();
  const { selectedWallet: injectiveSelectedWallet, wallets: injectiveWallets } =
    useInjectiveWallets();
  const tempCardId = searchParams.get('cardid');

  const router = useRouter();

  useEffect(() => {
    if (
      (!selectedWallet || !wallets[selectedWallet].walletKeys) &&
      (!injectiveSelectedWallet ||
        !injectiveWallets[injectiveSelectedWallet].walletKeys)
    ) {
      router.push('/');
    }
  }, [selectedWallet, injectiveWallets]);
  return (
    <NotifiContextWrapper cardId={tempCardId ?? undefined}>
      {children}
    </NotifiContextWrapper>
  );
}
