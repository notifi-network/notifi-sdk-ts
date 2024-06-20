'use client';

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
    <div className="w-full min-h-screen flex flex-col items-center justify-start md:items-center bg-notifi-page-bg">
      <div className="w-full md:mt-8 m-3 flex flex-row justify-between items-center">
        <div className="ml-8 flex items-center md:justify-start justify-center w-full my-4 md:my-0">
          <Image
            src="/logos/XION-logo.png"
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
