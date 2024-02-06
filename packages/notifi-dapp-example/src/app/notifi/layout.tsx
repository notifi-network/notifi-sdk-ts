'use client';

import { NotifiSubscriptionCardProvider } from '@/context/notifi/NotifiSubscriptionCardProvider';
import { useChain } from '@cosmos-kit/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function NotifiSingupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isWalletConnected } = useChain('injective');

  const router = useRouter();
  useEffect(() => {
    if (!isWalletConnected) {
      router.push('/');
    }
  }, [isWalletConnected]);
  return (
    <NotifiSubscriptionCardProvider>{children}</NotifiSubscriptionCardProvider>
  );
}
