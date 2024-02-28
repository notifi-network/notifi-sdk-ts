'use client';

import { AlertSubscription } from '@/components/AlertSubscription';
import { DashboardDestinations } from '@/components/DashboardDestinations';
import { DashboardHistory } from '@/components/DashboardHistory';
import { DashboardSideBar } from '@/components/DashboardSideBar';
import { VerifyBanner } from '@/components/VerifyBanner';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { WalletAccount } from '@cosmos-kit/core';
import { useWalletClient } from '@cosmos-kit/react';
import { useDestinationState } from '@notifi-network/notifi-react-card';
import { useEffect, useState } from 'react';

export type CardView = 'history' | 'destination' | 'alertSubscription';

export default function NotifiDashboard() {
  const { client } = useWalletClient();
  const [cardView, setCardView] = useState<CardView>('history');
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { unverifiedDestinations } = useDestinationState();

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
    <div className="min-h-screen flex  items-center ">
      <DashboardSideBar
        account={account}
        cardView={cardView}
        setCardView={setCardView}
      />
      <div className=" flex flex-col grow h-screen">
        {unverifiedDestinations.length > 0 && cardView === 'history' ? (
          <VerifyBanner setCardView={setCardView} />
        ) : null}
        {/* IMPORTANT: Do not remove `min-h-0` , This is to fix the inner card height */}
        <div className="flex flex-col grow bg-white rounded-3xl mb-10 mt-3 mr-10 min-h-0 ">
          {cardView === 'history' ? <DashboardHistory /> : null}
          {cardView === 'destination' ? <DashboardDestinations /> : null}
          {cardView === 'alertSubscription' ? <AlertSubscription /> : null}
        </div>
      </div>
    </div>
  );
}
