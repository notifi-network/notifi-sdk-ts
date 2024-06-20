'use client';

import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import Image from 'next/image';

export default function NotifiFTU({ children }: { children: React.ReactNode }) {
  useNotifiRouter();

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start md:items-center bg-notifi-page-bg">
      <div className="w-full md:mt-8 m-3 flex flex-row justify-between items-center">
        <div className="ml-8 flex items-center justify-center md:justify-start w-full my-4 md:my-0">
          <Image
            src="/logos/xion-logo.png"
            width={115}
            height={24}
            unoptimized={true}
            alt="XION logo"
          />
        </div>
      </div>
      {children}
    </div>
  );
}
