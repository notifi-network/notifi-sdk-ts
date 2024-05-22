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
            src="/logos/gmx-logo.png"
            width={115}
            height={24}
            unoptimized={true}
            alt="GMX logo"
          />
        </div>
        <div className="p-2 rounded-lg h-7 hidden md:block">
          <PoweredByNotifi />
        </div>
      </div>

      {children}
    </>
  );
}
