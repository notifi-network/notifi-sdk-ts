'use client';

import { Icon } from '@/assets/Icon';
import { AlertSubscription } from '@/components/AlertSubscription';
import { DashboardDestinations } from '@/components/DashboardDestinations';
import { DashboardHistory } from '@/components/DashboardHistory';
import { DashboardSideBar } from '@/components/DashboardSideBar';
import { VerifyBanner } from '@/components/VerifyBanner';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { WalletAccount } from '@cosmos-kit/core';
import { useWalletClient } from '@cosmos-kit/react';
import { useDestinationState } from '@notifi-network/notifi-react-card';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export type CardView = 'history' | 'destination' | 'alertSubscription';

export default function NotifiDashboard() {
  const { client } = useWalletClient();
  const [cardView, setCardView] = useState<CardView>('history');
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { unverifiedDestinations } = useDestinationState();
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  // TODO: Move to hook if any other component needs account
  useEffect(() => {
    if (client) {
      setIsGlobalLoading(true);
      client
        ?.getAccount?.('injective-1')
        .then((account) => {
          if (account) {
            setAccount(account);
          }
        })
        .finally(() => setIsGlobalLoading(false));
      return;
    }
    setAccount(null);
  }, [client]);

  if (!account) return null;

  return (
    <div className="min-h-screen flex items-start flex-row">
      {/* desktop sidebar */}
      <DashboardSideBar
        account={account}
        cardView={cardView}
        setCardView={setCardView}
      />
      {/* mobile sidebar */}
      {isSideBarOpen ? (
        <DashboardSideBar
          account={account}
          cardView={cardView}
          setCardView={setCardView}
          setIsOpen={setIsSideBarOpen}
        />
      ) : null}
      <div className="flex flex-col grow h-screen">
        <div className="md:hidden w-screen flex justify-center">
          <Icon
            id="btn-nav"
            className="top-6 left-4 cursor-pointer fixed"
            onClick={() => setIsSideBarOpen(true)}
          />
          <Image
            className="mt-3"
            src="/logos/injective.png"
            width={115}
            height={24}
            alt="Injective"
            unoptimized={true}
          />
        </div>
        {unverifiedDestinations.length > 0 && cardView === 'history' ? (
          <VerifyBanner setCardView={setCardView} />
        ) : null}
        {/* IMPORTANT: Do not remove `min-h-0` , This is to fix the inner card height */}
        <div
          className={`flex flex-col grow bg-white rounded-3xl md:mb-10 mt-3 md:mr-10 ${
            cardView === 'alertSubscription' ? '' : 'min-h-0'
          } shadow-card`}
        >
          {cardView === 'history' ? <DashboardHistory /> : null}
          {cardView === 'destination' ? <DashboardDestinations /> : null}
          {cardView === 'alertSubscription' ? (
            <AlertSubscription
              title={'Manage the alerts you want to receive'}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
