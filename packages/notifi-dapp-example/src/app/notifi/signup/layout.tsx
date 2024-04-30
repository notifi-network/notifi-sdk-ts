'use client';

import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
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
    <div className="w-full min-h-screen flex flex-col items-center justify-start md:items-center bg-notifi-page-bg">
      <div className="w-full md:mt-8 m-3 flex flex-row justify-between items-center">
        <div className="ml-8 flex items-center">
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
        <div className="p-2 bg-white rounded-lg h-7 hidden md:block mr-8">
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
