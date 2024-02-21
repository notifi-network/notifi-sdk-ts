'use client';

import { AlertSubscription } from '@/components/AlertSubscription';
import { DashboardSideBar } from '@/components/DashboardSideBar';
import { HistoryDetail } from '@/components/HistoryDetail';
import { HistoryList } from '@/components/HistoryList';
import { VerifyBanner } from '@/components/VerifyBanner';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { WalletAccount } from '@cosmos-kit/core';
import { useWalletClient } from '@cosmos-kit/react';
import { Types } from '@notifi-network/notifi-graphql';
import { useEffect, useState } from 'react';

export type CardView = 'history' | 'destination' | 'alertSubscription';

export default function NotifiDashboard() {
  const { client } = useWalletClient();
  const [cardView, setCardView] = useState<CardView>('history');
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [historyDetailEntry, setHistoryDetailEntry] =
    useState<Types.FusionNotificationHistoryEntryFragmentFragment | null>(null);
  const { setIsGlobalLoading } = useGlobalStateContext();

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
        <VerifyBanner />
        <div className="grow bg-white rounded-3xl mb-10 mt-3 mr-10">
          {cardView === 'history' ? (
            <>
              <HistoryList
                setHistoryDetailEntry={setHistoryDetailEntry}
                historyDetailEntry={historyDetailEntry}
              />
              {historyDetailEntry ? (
                <HistoryDetail
                  setHistoryDetailEntry={setHistoryDetailEntry}
                  historyDetailEntry={historyDetailEntry}
                />
              ) : null}
            </>
          ) : null}
          {cardView === 'destination' ? <div>Dummy Destination</div> : null}
          {cardView === 'alertSubscription' ? <AlertSubscription /> : null}
        </div>
      </div>
    </div>
  );
}
