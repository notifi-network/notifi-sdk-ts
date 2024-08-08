'use client';

import Disconnect from '@/components/Disconnect';
import { NotifiContextWrapper } from '@/context/NotifiContextWrapper';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function NotifiSingupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { wallets, selectedWallet, isAuthenticationVerified } = useWallets();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      (!selectedWallet || !wallets[selectedWallet].walletKeys) &&
      isAuthenticationVerified
    ) {
      router.push('/');
    }
  }, [selectedWallet, isAuthenticationVerified]);

  const showDisconnectButton = ['/notifi/ftu', '/notifi/signup'].includes(
    pathname,
  );

  return (
    <>
      {showDisconnectButton ? (
        <div className={`fixed z-40 top-7 right-0.5 hidden md:block`}>
          <Disconnect />
        </div>
      ) : null}

      <QueryClientProvider client={new QueryClient()}>
        <NotifiContextWrapper>{children}</NotifiContextWrapper>
      </QueryClientProvider>
    </>
  );
}
