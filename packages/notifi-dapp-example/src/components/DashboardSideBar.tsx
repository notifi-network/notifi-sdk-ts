'use client';

import { CardView } from '@/app/notifi/dashboard/page';
import { Icon } from '@/assets/Icon';
import { WalletAccount } from '@cosmos-kit/core';
import Image from 'next/image';
import { Dispatch, FC, SetStateAction } from 'react';

export type DashboardSideBarProps = {
  account: WalletAccount;
  cardView: string;
  setCardView: Dispatch<SetStateAction<CardView>>;
};

export const DashboardSideBar: FC<DashboardSideBarProps> = ({
  account,
  cardView,
  setCardView,
}) => {
  // TODO: remove (for utility only)
  // const { disconnect, isWalletConnected } = useChain('injective');
  return (
    <div className="grow-0 w-80 h-screen px-7">
      <Image
        src="/logos/injective.png"
        width={250}
        height={115}
        alt="Injective"
        className="m-auto"
      />
      <div
        onClick={() => setCardView('history')}
        className={`flex px-4 ${
          cardView === 'history'
            ? 'bg-white shadow-md'
            : 'text-notifi-tab-unselected-text'
        }  w-64 py-3 rounded-lg mb-2 cursor-pointer`}
      >
        <Icon
          id={'inbox'}
          className={`${
            cardView === 'history'
              ? 'text-notifi-icon-selected'
              : 'text-notifi-icon-unselected'
          }`}
        />
        <div className="ml-5">Inbox</div>
      </div>
      <div
        onClick={() => setCardView('destination')}
        className={`flex px-4  w-64 py-3 rounded-lg mb-2 cursor-pointer ${
          cardView === 'destination'
            ? 'bg-white shadow-md'
            : 'text-notifi-tab-unselected-text'
        }`}
      >
        <Icon
          id={'destinations'}
          className={`${
            cardView === 'destination'
              ? 'text-notifi-icon-selected'
              : 'text-notifi-icon-unselected'
          }`}
        />
        <div className="ml-5">Destination</div>
      </div>
      <div
        onClick={() => setCardView('alertSubscription')}
        className={`flex px-4 w-64 py-3 rounded-lg mb-2 cursor-pointer ${
          cardView === 'alertSubscription'
            ? 'bg-white shadow-md'
            : 'text-notifi-tab-unselected-text'
        }`}
      >
        <Icon
          id={'config'}
          className={`${
            cardView === 'alertSubscription'
              ? 'text-notifi-icon-selected'
              : 'text-notifi-icon-unselected'
          }`}
        />
        <div className="ml-5">Alert Subscription</div>
      </div>

      <div className="w-full border-dashed border border-gray-300 my-6"></div>

      <div
        className={`flex px-4 text-notifi-tab-unselected-text w-64 py-4 rounded-lg mb-2`}
      >
        <Icon id={'user-protrait'} className={`text-notifi-icon-unselected`} />
        <div className="ml-5">
          {account?.address.slice(0, 6)} ... {account?.address.slice(-6)}
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
      {/* {isWalletConnected ? (
          // NOTE: This hidden button is just FYI in case disconnect is needed during development
          <button
            className="bg-red-100 p-5 rounded hidden"
            onClick={() => {
              if (!disconnect) return console.log('no disconnect');
              disconnect();
            }}
          >
            disconnect wallet
          </button>
        ) : null} */}
    </div>
  );
};
