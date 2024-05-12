'use client';

import { Icon } from '@/assets/Icon';
import { AlertSubscription } from '@/components/AlertSubscription';
import { DashboardDestinations } from '@/components/DashboardDestinations';
import { DashboardHistory } from '@/components/DashboardHistory';
import { DashboardSideBar } from '@/components/DashboardSideBar';
import { VerifyBanner } from '@/components/VerifyBanner';
import { useNotifiTargetContext } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { useState } from 'react';

export type CardView = 'history' | 'destination' | 'alertSubscription';

export default function NotifiDashboard() {
  const [cardView, setCardView] = useState<CardView>('history');
  const { unVerifiedTargets } = useNotifiTargetContext();
  const { selectedWallet, wallets } = useWallets();
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  if (!selectedWallet || !wallets[selectedWallet].walletKeys) return null;

  let accountAddress: string | undefined = '';
  if (selectedWallet) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    accountAddress = wallets[selectedWallet].walletKeys.hex ?? '';
  }

  if (!accountAddress) return;
  return (
    <div className="min-h-screen flex items-start flex-row">
      {/* desktop sidebar */}
      <DashboardSideBar
        accountAddress={accountAddress}
        cardView={cardView}
        setCardView={setCardView}
      />
      {/* mobile sidebar */}
      {isSideBarOpen ? (
        <DashboardSideBar
          accountAddress={accountAddress}
          cardView={cardView}
          setCardView={setCardView}
          setIsOpen={setIsSideBarOpen}
        />
      ) : null}
      <div
        className={`flex flex-col grow ${
          cardView === 'alertSubscription' ? 'm-h-screen' : 'h-screen'
        } md:ml-80`}
      >
        <div className="md:hidden w-screen flex justify-center">
          <Icon
            id="btn-nav"
            className="top-6 left-4 cursor-pointer fixed text-notifi-text"
            onClick={() => setIsSideBarOpen(true)}
          />
          <Image
            src="/logos/gmx-logo.png"
            width={115}
            height={24}
            unoptimized={true}
            alt="gmx"
            className="mt-10 mb-6"
          />
        </div>
        {unVerifiedTargets.length > 0 && cardView === 'history' ? (
          <VerifyBanner setCardView={setCardView} />
        ) : null}
        <div
          className={`flex flex-col grow bg-notifi-card-bg rounded-3xl md:mb-10 mt-3 md:mr-10 ${
            cardView === 'alertSubscription' ? '' : 'min-h-0'
          }`}
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
