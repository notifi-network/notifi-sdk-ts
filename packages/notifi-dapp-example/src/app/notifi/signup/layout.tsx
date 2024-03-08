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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-notifi-page-bg">
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
            INJECTIVE ECOSYSTEM ALERTS
          </div>
        </div>
        <div className=" p-2 bg-white rounded-lg h-7">
          <PoweredByNotifi />
        </div>
      </div>
      {children}
    </div>
  );
}
