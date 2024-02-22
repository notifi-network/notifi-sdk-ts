'use client';

import { Icon } from '@/assets/Icon';
import { PoweredByNotifi } from '@/components/PoweredByNotifi';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useChain, useWalletClient } from '@cosmos-kit/react';
import '@interchain-ui/react/styles';
import Image from 'next/image';
import { useEffect } from 'react';

const displayedAlerts = [
  'Developer Alerts',
  'General Alerts',
  'Node Operator Alerts',
  'Market Updates',
  'Trader Alerts',
];

export default function Home() {
  const { connect, isWalletConnecting } = useChain('injective');
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const { client } = useWalletClient();

  useEffect(() => {
    if (client) {
      client?.getAccount?.('injective-1').then((account) => {
        if (account) {
          handleRoute('/notifi');
        }
      });
    }
  }, [client]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="fixed top-8 left-8 right-8 flex justify-between">
        <div className="left-8 flex items-center">
          <Image
            src="/logos/injective.png"
            width={115}
            height={24}
            alt="Injective"
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
      <div className="flex flex-col gap-4 bg-white p-10 max-w-[33.37rem] rounded-3xl">
        <div className="flex items-center w-48 gap-3">
          <Image
            src="/logos/injective.png"
            width={95}
            height={15}
            alt="Injective"
          />
          <div className="text-gray-400">x</div>
          <div className="flex w-16 justify-between">
            <Image
              src="/logos/notifi.svg"
              width={15}
              height={15}
              alt="Injective"
            />
            <Image
              src="/logos/notifi-text.svg"
              width={40}
              height={15}
              alt="Injective"
            />
          </div>
        </div>

        <div className="text-5xl font-semibold">
          Injective Ecosystem{' '}
          <span className="text-notifi-primary-text">alerts</span>
        </div>

        <div className="text-gray-500 ">
          Build and use best-in-class applications on the network shaping the
          future.
        </div>

        <button className=" bg-notifi-button-primary-blueish-bg w-52 h-11 cursor-pointer rounded-lg text-white">
          {isWalletConnecting || isLoadingRouter ? (
            <div className="m-auto h-5 w-5 animate-spin rounded-full  border-2 border-white border-b-transparent border-l-transparent"></div>
          ) : (
            <div onClick={() => connect?.()}>Connect Wallet To Start</div>
          )}
        </button>
      </div>
      <div className="flex flex-col gap-4 bg-white/50 p-10 max-w-[33.37rem] rounded-3xl mt-2">
        <div className="font-medium">Which alerts can I sign up for?</div>
        <div className="w-[28.37rem] flex flex-wrap ">
          {displayedAlerts.map((alert) => (
            <div key={alert} className="w-52 flex items-center">
              <Icon
                id="right-arrow"
                width={11}
                height={11}
                className="text-notifi-primary-text mr-2"
              />
              <div className="ml-3 text-sm font-medium text-gray-800">
                {alert}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
