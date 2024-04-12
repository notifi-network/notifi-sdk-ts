'use client';

import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import Image from 'next/image';

export default function NotifiFTU({ children }: { children: React.ReactNode }) {
  useNotifiRouter();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start md:items-center bg-notifi-page-bg">
      <div className="w-full md:mt-8 m-3 flex flex-row justify-between items-center">
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
      <div className="p-2 bg-white rounded-lg h-7 block md:hidden w-[110px] m-2">
        <PoweredByNotifi />
      </div>
    </div>
  );
}
