'use client';

import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useNotifiFrontendClientContext } from '@notifi-network/notifi-react';
import Image from 'next/image';

export default function NotifiSignup({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotifiRouter();

  const {
    frontendClientStatus: { isInitialized },
  } = useNotifiFrontendClientContext();
  if (!isInitialized) return null;

  return (
    <div className="w-full h-screen flex flex-col justify-start items-center md:items-center md:justify-center bg-notifi-page-bg">
      <div className="md:fixed md:top-8 md:left-8 md:right-8 m-3 md:m-0 flex justify-between items-center">
        <div className="left-8 flex items-center">
          <Image
            src="/logos/gmx-logo.png"
            width={115}
            height={24}
            unoptimized={true}
            alt="Injective"
          />
        </div>
        <div className="p-2 rounded-lg h-7 hidden md:block">
          <PoweredByNotifi />
        </div>
      </div>
      {children}
      <div className="p-2 bg-white rounded-lg h-7 block md:hidden w-[110px] mt-2">
        <PoweredByNotifi />
      </div>
    </div>
  );
}
