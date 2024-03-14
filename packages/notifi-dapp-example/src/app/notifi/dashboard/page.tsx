'use client';

import { AlertSubscription } from '@/components/AlertSubscription';
import { DashboardDestinations } from '@/components/DashboardDestinations';
import { DashboardHistory } from '@/components/DashboardHistory';
import { DashboardSideBar } from '@/components/DashboardSideBar';
import { VerifyBanner } from '@/components/VerifyBanner';
import { useDestinationState } from '@notifi-network/notifi-react-card';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useState } from 'react';

export type CardView = 'history' | 'destination' | 'alertSubscription';

export default function NotifiDashboard() {
  const [cardView, setCardView] = useState<CardView>('history');
  const { unverifiedDestinations } = useDestinationState();
  const { selectedWallet, wallets } = useWallets();

  if (!selectedWallet || !wallets[selectedWallet].walletKeys) return null;
  const accountAddress = wallets[selectedWallet].walletKeys?.bech32;
  if (!accountAddress) return;
  return (
    <div className="min-h-screen flex items-start flex-row">
      <DashboardSideBar
        accountAddress={accountAddress}
        cardView={cardView}
        setCardView={setCardView}
      />
      <div className=" flex flex-col grow h-screen ">
        {unverifiedDestinations.length > 0 && cardView === 'history' ? (
          <VerifyBanner setCardView={setCardView} />
        ) : null}
        {/* IMPORTANT: Do not remove `min-h-0` , This is to fix the inner card height */}
        <div className="flex flex-col grow bg-white rounded-3xl mb-10 mt-3 mr-10 min-h-0 shadow-card">
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
