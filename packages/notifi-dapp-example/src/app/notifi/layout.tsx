'use client';

import { NotifiCardContextProvider } from '@/context/notifi/NotifiCardContext';
import { NotifiContextProvider } from '@/context/notifi/NotifiContext';
import { useChain } from '@cosmos-kit/react';
import { NotifiFormProvider } from '@notifi-network/notifi-react-card';
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
    <NotifiContextProvider>
      <NotifiCardContextProvider>
        <NotifiFormProvider>{children}</NotifiFormProvider>
      </NotifiCardContextProvider>
    </NotifiContextProvider>
  );
}
