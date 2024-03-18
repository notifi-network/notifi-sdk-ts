'use client';

import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import Image from 'next/image';

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
    <div className="w-full h-screen flex flex-col justify-start items-center md:items-center md:justify-center bg-notifi-page-bg">
      <div className="md:fixed md:top-8 md:left-8 md:right-8 m-3 md:m-0 flex justify-between">
        <div className="left-8 flex items-center">
          <Image
            src="/logos/injective.png"
            width={115}
            height={24}
            alt="Injective"
            unoptimized={true}
          />
          <div className="mx-4 h-4 border-l-2 border-grey-700"></div>
          <div className="text-gray-400 text-xs tracking-wider">
            INJECTIVE NOTIFICATIONS
          </div>
        </div>
        <div className="p-2 bg-white rounded-lg h-7 hidden md:block">
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
