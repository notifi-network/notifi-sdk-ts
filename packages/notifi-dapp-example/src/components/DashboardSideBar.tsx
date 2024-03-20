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
      className={`fixed md:relative grow-0 md:w-80 w-screen h-screen px-7 z-[5] ${
        setIsOpen ? 'md:hidden block bg-gradient-injective' : 'md:block hidden'
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
            src="/logos/injective.png"
            width={setIsOpen ? 115 : 167}
            height={setIsOpen ? 24 : 35}
            alt="Injective"
            className="mb-6 mt-3"
            unoptimized={true}
          />
          <div
            onClick={() => {
              setCardView('history');
              setIsOpen?.(false);
            }}
            className={`flex px-4 ${
              cardView === 'history'
                ? 'bg-white shadow-card'
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
            className={`flex px-4  w-64 py-3 rounded-[12px] mb-2 cursor-pointer ${
              cardView === 'destination'
                ? 'bg-white shadow-card'
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
                ? 'bg-white shadow-card'
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
            <div className="ml-5">Alert Subscription</div>
          </div>

          <div className="w-full border-dashed border border-gray-300 my-6"></div>

          <div
            className={`rounded-[0.75rem] overflow-hidden ${
              isWalletMenuOpen ? 'shadow-card' : ''
            }`}
          >
            <div
              className={`cursor-pointer flex px-4 text-notifi-tab-unselected-text w-64 py-2 ${
                isWalletMenuOpen
                  ? 'bg-white border border-transparent border-b-gray-500/20'
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
                className={`flex px-4 text-notifi-tab-unselected-text w-64 py-2 bg-white`}
                onClick={() => {
                  if (!selectedWallet) return;
                  wallets[selectedWallet].disconnect();
                }}
              >
                <Icon id={'leave'} className={`text-notifi-icon-unselected`} />
                <div className="ml-5 cursor-pointer">disconnect</div>
              </div>
            ) : null}
          </div>
        </div>
        <div className=" p-2 bg-white rounded-lg h-7 bg-opacity-40">
          <PoweredByNotifi width={127} height={16} />
        </div>
      </div>
      {/* TODO: utility for div (need remove) */}
      {/* <button
        className=""
        onClick={async () => {
          localforage
            .getItem(
              'notifi-jwt:4zfoga0vjqh90ahg8apd:INJECTIVE:inj16jy9dfckgauwagu4kuu54uys03hk8qagx7xr22:AzUWetRYpBdh6pQS1NUXHHNDKSjDqMM8OF+sbMrJw9sZ:authorization',
            )
            .then((res) => console.log('1', { res }));
        }}
      >
        get
      </button>
      <button
        className="block"
        onClick={async () => {
          const newValue = {
            expiry: '2023-12-15T08:15:39.170Z',
            token:
              'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwidHlwIjoiSldUIiwiY3R5IjoiSldUIn0..vOfww5LCrtKa2oNONIfRwQ.kqhZLcD0m-HhnZTju9smGHigof6oRPnrHJ4gJN2gY2PRaUb8aXcoDzNF8ndnIwNnUgekKA3fBABnvW0xBAsLkpmVIzkQpPEYhjEGywzJOfBF8VVFhf0nx9h_-WJP0dn6LcjHeq8wfiTPnnwzQ3t3onWWanDYEreYFNKjev7PmjhTM-jVkqw__PgxjDYjDbrcwM2bHymK03CZ5Ffbt2wCG2SSXGOoExg7iRYzoh02s7EtXtmu4Bceh3LH5CFjf6Ha8TaakVs1XyXPISpZKLnSkNXxekNvGJ-8GRrzgXYhTr6vHIciE-LACq0g1xIgcjkYBcBewjI1kACFqpSyUmDX1VGkIyEWVbboCmsUo7eYeo-btfz_dUV2dVFzSSCRLl0p6bLHpWPxrVoHvv5KF2Nky5FkzEzjzVA4ZJmaLR9qMNr0-_ub58apcW2LM4sRXUnyjfD3_rp95cAVuDmTv64uuBw3-iTMZdQvN7sMAvS0sxCxxYzimhhNOyiBsK4pF4-QY9opY2lQ9Ce6wU-o0JeBRNdgYqwsrWdiL6jDAXtW39OIxs3v5kDGvX8G3wjDWUoCJL0s8Cevi8MIshHMiMVRZLhffdKWUge09x3s1xrEo4ugQ6U9i7vwv_raoW7M8Rs6m_Z6OOG4B90-njTMj_8sZKvHWhMxIzxV9ABRWPMNTCv4oEWCOUtFN_ggZWRvGsfC63nG_6LAA9hI0iVEuS7MJLXsI0Yq7eck9SPve1c3LLR7dlddeBNKm78Nvy2diIVup0VzltgRlcVYu12ioR_GyrXux40gaKnm4McNdPdo51u1W2vAbQOyP1bn2dRrp9isbi3xJ4ablZ-Q7St-5sVPww4pMLBlC-u8DEcDMJXuBOzmjwj4jPAHtPN0D38ElUAERuXbUoYNkMV6KNoM7TRv7g.uygptp7IFvCVVtBdxZW7URZtRMBQAUkiEkmRgTHwtnU',
          };
          localforage
            .setItem(
              'notifi-jwt:4zfoga0vjqh90ahg8apd:INJECTIVE:inj16jy9dfckgauwagu4kuu54uys03hk8qagx7xr22:AzUWetRYpBdh6pQS1NUXHHNDKSjDqMM8OF+sbMrJw9sZ:authorization',
              newValue,
            )
            .then((res) => console.log('1', { res }));
        }}
      >
        set
      </button> */}
    </div>
  );
};
