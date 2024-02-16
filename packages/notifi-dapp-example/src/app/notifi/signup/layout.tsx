'use client';

import { DappIcon } from '@/components/DappIcon';
import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';

export default function NotifiSignup({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotifiRouter();

  const {
    frontendClientStatus: { isInitialized, isAuthenticated },
  } = useNotifiClientContext();
  if (!isInitialized || isAuthenticated) return null;

  return (
    <div className="w-full h-screen flex flex-col items-center justify-start bg-notifi-page-bg">
      <DappIcon />
      <div className="text-blue-500 font-bold text-lg mb-8">
        Injective ecosystem alerts
      </div>
      {children}
      <PoweredByNotifi />
    </div>
  );
}
