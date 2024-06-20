'use client';

import { CardView } from '@/app/notifi/dashboard/page';
import { Icon } from '@/assets/Icon';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';

import Disconnect from './Disconnect';
import { PoweredByNotifi } from './PoweredByNotifi';

export type DashboardSideBarProps = {
  accountAddress: string;
  cardView: string;
  setCardView: Dispatch<SetStateAction<CardView>>;
  setIsOpen?: Dispatch<SetStateAction<boolean>>;
};

export const DashboardSideBar: FC<DashboardSideBarProps> = ({
  cardView,
  setCardView,
  setIsOpen,
}) => {
  return (
    <div
      className={`fixed grow-0 md:w-80 w-screen h-screen px-7 z-[5] ${
        setIsOpen ? 'md:hidden block bg-black' : 'md:block hidden'
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
            src="/logos/xion-logo-white.png"
            width={setIsOpen ? 115 : 81}
            height={setIsOpen ? 24 : 29}
            alt="xion-logo"
            className="mt-8 mb-10"
            unoptimized={true}
          />
          <div
            onClick={() => {
              setCardView('history');
              setIsOpen?.(false);
            }}
            className={`flex px-4 ${
              cardView === 'history'
                ? 'bg-white text-notifi-text'
                : 'text-notifi-tab-unselected-text'
            }  w-64 py-3 rounded-3xl mb-2 cursor-pointer`}
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
            className={`flex px-4 w-64 py-3 rounded-3xl mb-2 cursor-pointer ${
              cardView === 'destination'
                ? 'bg-white text-notifi-text'
                : 'text-notifi-tab-unselected-text'
            }`}
          >
            <Icon
              id={'destinations'}
              className={`${
                cardView === 'destination'
                  ? 'bg-whtie text-notifi-icon-selected'
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
            className={`flex px-4 w-64 py-3 rounded-3xl mb-2 cursor-pointer ${
              cardView === 'alertSubscription'
                ? 'bg-white text-notifi-text'
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

          <Disconnect />
        </div>
        <div>
          <div className="py-1.5 px-3 bg-white rounded-lg h-7 bg-opacity-15">
            <PoweredByNotifi width={127} height={16} isLightLogo={true} />
          </div>

          <div className="text-[10px] text-white mt-4 ml-1">
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
