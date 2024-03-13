'use client';

import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import Image from 'next/image';

export default function NotifiFTU({ children }: { children: React.ReactNode }) {
  useNotifiRouter();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-notifi-page-bg">
      <div className="w-full mt-8 flex flex-row justify-between">
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
            INJECTIVE ECOSYSTEM ALERTS
          </div>
        </div>
        <div className=" p-2 bg-white rounded-lg h-7 mr-8">
          <PoweredByNotifi />
        </div>
      </div>
      {children}
    </div>
  );
}
