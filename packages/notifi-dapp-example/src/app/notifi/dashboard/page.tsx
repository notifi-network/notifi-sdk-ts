'use client';

import { Icon } from '@/assets/Icon';
import { ConfigAlertModal } from '@/components/ConfigAlertModal';
import { DashboardDestinations } from '@/components/DashboardDestinations';
import { DashboardHistory } from '@/components/DashboardHistory';
import { DashboardSideBar } from '@/components/DashboardSideBar';
import { TopicList } from '@/components/TopicList';
import { VerifyBanner } from '@/components/VerifyBanner';
import { isEVMChain } from '@/utils/typeUtils';
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
  const [isInHistoryDetail, setIsInHistoryDetail] = useState<boolean>(false);

  if (!selectedWallet || !wallets[selectedWallet].walletKeys) return null;

  let accountAddress: string | undefined = '';
  const keys = wallets[selectedWallet].walletKeys;

  if (keys) {
    accountAddress = isEVMChain(keys) ? keys.hex?.toLowerCase() : keys.bech32;
  }

  if (!accountAddress) return;
  return (
    <div className="min-h-screen flex items-start flex-row bg-black">
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
            className="top-6 left-4 cursor-pointer fixed text-white"
            onClick={() => setIsSideBarOpen(true)}
          />
          <Image
            src="/logos/xion-logo-white.png"
            width={100}
            height={21}
            unoptimized={true}
            alt="xion logo"
            className="mt-5 mb-4"
          />
        </div>
        {unVerifiedTargets.length > 0 && cardView === 'history' ? (
          <VerifyBanner
            setCardView={setCardView}
            isInHistoryDetail={isInHistoryDetail}
          />
        ) : null}
        <div
          className={`flex flex-col grow bg-white rounded-3xl md:mb-10 mt-3 md:mr-10 ${
            cardView === 'alertSubscription' ? '' : 'min-h-0'
          }`}
        >
          {cardView === 'history' ? (
            <DashboardHistory setIsInHistoryDetail={setIsInHistoryDetail} />
          ) : null}
          {cardView === 'destination' ? <DashboardDestinations /> : null}
          {cardView === 'alertSubscription' ? <ConfigAlertModal /> : null}
        </div>
      </div>
    </div>
  );
}
