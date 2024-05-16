'use client';

import { CardView } from '@/app/notifi/dashboard/page';
import { Icon } from '@/assets/Icon';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction, useState } from 'react';

import { PoweredByNotifi } from './PoweredByNotifi';

export type DashboardSideBarProps = {
  accountAddress: string;
  cardView: string;
  setCardView: Dispatch<SetStateAction<CardView>>;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export const DashboardSideBar: FC<DashboardSideBarProps> = ({
  accountAddress,
  cardView,
  setCardView,
  setIsOpen,
}) => {
  const { wallets, selectedWallet } = useWallets();
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState<boolean>(false);

  return (
    <div
      className={`fixed grow-0 md:w-80 w-screen h-screen px-7 z-[5] ${
        setIsOpen ? 'md:hidden block bg-gradient-gmx' : 'md:block hidden'
      }`}
    >
      <div className="flex flex-col justify-between items-center md:items-start h-full pb-6">
        <div className="flex flex-col items-center md:items-start">
          {setIsOpen ? (
            <Icon
              id="close-icon"
              className="text-notifi-text-light top-6 left-4 cursor-pointer fixed"
              onClick={() => setIsOpen(false)}
            />
          ) : null}
          <Image
            src="/logos/gmx-logo.png"
            width={setIsOpen ? 115 : 103}
            height={setIsOpen ? 24 : 26}
            alt="gmx-logo"
            className="my-10"
            unoptimized={true}
          />
          <div
            onClick={() => {
              setCardView('history');
              setIsOpen?.(false);
            }}
            className={`flex px-4 ${
              cardView === 'history'
                ? 'bg-gradient-side-nav-card text-notifi-text'
                : 'text-notifi-tab-unselected-text'
            }  w-64 py-3 rounded-[12px] mb-2 cursor-pointer`}
          >
            <Icon
              id={'inbox'}
              className={`${
                cardView === 'history'
                  ? 'text-notifi-icon-selected'
                  : 'text-notifi-icon-unselected'
              } mt-[0.125rem]`}
            />
            <div className="ml-5">Inbox</div>
          </div>
          <div
            onClick={() => {
              setCardView('destination');
              setIsOpen?.(false);
            }}
            className={`flex px-4 w-64 py-3 rounded-[12px] mb-2 cursor-pointer ${
              cardView === 'destination'
                ? 'bg-gradient-side-nav-card text-notifi-text'
                : 'text-notifi-tab-unselected-text'
            }`}
          >
            <Icon
              id={'destinations'}
              className={`${
                cardView === 'destination'
                  ? 'text-notifi-icon-selected'
                  : 'text-notifi-icon-unselected'
              } mt-[0.125rem]`}
            />
            <div className="ml-5">Destinations</div>
          </div>
          <div
            onClick={() => {
              setCardView('alertSubscription');
              setIsOpen?.(false);
            }}
            className={`flex px-4 w-64 py-3 rounded-[12px] mb-2 cursor-pointer ${
              cardView === 'alertSubscription'
                ? 'bg-gradient-side-nav-card text-notifi-text'
                : 'text-notifi-tab-unselected-text'
            }`}
          >
            <Icon
              id={'config'}
              className={`${
                cardView === 'alertSubscription'
                  ? 'text-notifi-icon-selected'
                  : 'text-notifi-icon-unselected'
              } mt-[0.125rem]`}
            />
            <div className="ml-5">Alert Subscriptions</div>
          </div>

          <div className="w-full border border-gray-200 border-opacity-20 my-6"></div>

          <div className={`rounded-[0.75rem] overflow-hidden`}>
            <div
              className={`cursor-pointer flex px-4 text-notifi-tab-unselected-text w-64 py-2 ${
                isWalletMenuOpen
                  ? 'bg-notifi-wallet-menu-card-bg border border-transparent'
                  : ''
              } 
              `}
              onClick={() => setIsWalletMenuOpen(!isWalletMenuOpen)}
            >
              <Icon
                id={'user-protrait'}
                className={`text-notifi-icon-unselected  mt-[0.125rem]`}
              />
              <div className="ml-5">
                {accountAddress.slice(0, 6)} ... {accountAddress.slice(-6)}
              </div>
            </div>
            {isWalletMenuOpen ? (
              <div
                className={`flex px-4 text-notifi-tab-unselected-text w-64 py-2 bg-notifi-wallet-menu-card-bg`}
                onClick={() => {
                  if (!selectedWallet) return;
                  if (selectedWallet) {
                    wallets[selectedWallet].disconnect();
                  }
                }}
              >
                <Icon id={'leave'} className={`text-notifi-icon-unselected`} />
                <div className="ml-5 cursor-pointer">disconnect</div>
              </div>
            ) : null}
          </div>
        </div>
        <div>
          <div className="py-1.5 px-3 bg-notifi-destination-card-bg rounded-lg h-7 bg-opacity-40">
            <PoweredByNotifi width={127} height={16} />
          </div>

          <div className="text-[10px] text-notifi-text-medium text-center mt-4 ml-1">
            <a
              href="https://notifi.network/privacy"
              target="_blank"
              className="underline"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="https://notifi.network/terms"
              target="_blank"
              className="underline"
            >
              Terms of Use
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
};
