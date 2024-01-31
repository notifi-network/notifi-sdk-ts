'use client';

import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import Image from 'next/image';

export default function NotifiExpiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useNotifiRouter();

  return (
    <>
      <div className="fixed top-8 left-8 right-8 flex justify-between">
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
        <div className=" p-2 bg-white rounded-lg h-7">
          <PoweredByNotifi />
        </div>
      </div>

      {children}
    </>
  );
}
