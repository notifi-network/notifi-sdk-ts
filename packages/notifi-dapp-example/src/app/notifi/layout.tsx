'use client';

import Disconnect from '@/components/Disconnect';
import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';

function NotifiLayoutContent({ children }: { children: React.ReactNode }) {
  const { wallets, selectedWallet, isLoading } = useWallets();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCardId = searchParams.get('cardid');

  useEffect(() => {
    if (
      (!selectedWallet || !wallets[selectedWallet]?.walletKeys) &&
      !isLoading
    ) {
      router.push('/');
    }
  }, [selectedWallet, isLoading, wallets, router]);

  const showDisconnectButton = ['/notifi/ftu', '/notifi/signup'].includes(
    pathname,
  );

  return (
    <QueryClientProvider client={new QueryClient()}>
      <NotifiContextWrapper cardId={urlCardId ?? undefined}>
        {showDisconnectButton ? (
          <div className={`fixed z-40 top-7 right-0.5 hidden md:block`}>
            <Disconnect />
          </div>
        ) : null}
        {children}
      </NotifiContextWrapper>
    </QueryClientProvider>
  );
}

export default function NotifiSingupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotifiLayoutContent>{children}</NotifiLayoutContent>
    </Suspense>
  );
}
