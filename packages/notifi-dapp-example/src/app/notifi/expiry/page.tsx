'use client';

import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useChain } from '@cosmos-kit/react';
import {
  useFrontendClientLogin,
  useNotifiClientContext,
} from '@notifi-network/notifi-react-card';
import Image from 'next/image';
import { useEffect } from 'react';

export default function NotifiExpiry() {
  const { disconnect } = useChain('injective');
  const { frontendClientStatus } = useNotifiClientContext();
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const login = useFrontendClientLogin();
  useEffect(() => {
    if (!frontendClientStatus.isExpired) {
      handleRoute('/notifi');
    }
  }, [frontendClientStatus]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="flex justify-between items-center">
          <Image
            src="/logos/injective.png"
            width={250}
            height={115}
            alt="Injective"
          />
          <div className="mx-4 h-14 border-l border-grey-700"></div>
          <div className="flex w-40 justify-between">
            <Image
              src="/logos/notifi.svg"
              width={38}
              height={38}
              alt="Injective"
            />
            <Image
              src="/logos/notifi-text.svg"
              width={105}
              height={38}
              alt="Injective"
            />
          </div>
        </div>

        <div className="text-4xl font-extrabold mb-7 text-notifi-label-connect-wallet-text">
          Injective ecosystem alerts
        </div>

        <div className="w-64 text-center mb-4">
          It’s been a while! Connect to Notifi to load your notification
          details.
        </div>
        <button
          className="rounded bg-notifi-button-primary-bg text-notifi-button-primary-text w-72 h-11"
          onClick={() => login()}
        >
          {isLoadingRouter ? (
            <div className="m-auto h-5 w-5 animate-spin rounded-full  border-2 border-white border-b-transparent border-l-transparent"></div>
          ) : (
            <div>Connect to Notifi</div>
          )}
        </button>
      </div>
      <button
        className="bg-red-100 p-5 rounded hidden"
        onClick={() => {
          if (!disconnect) return console.log('no disconnect');
          disconnect();
        }}
      >
        disconnect wallet
      </button>
    </div>
  );
}
