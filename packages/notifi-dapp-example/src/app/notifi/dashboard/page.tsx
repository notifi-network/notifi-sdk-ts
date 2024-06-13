'use client';

import { Icon } from '@/assets/Icon';
import { AlertSubscription } from '@/components/AlertSubscription';
import { DashboardDestinations } from '@/components/DashboardDestinations';
import { DashboardHistory } from '@/components/DashboardHistory';
import { DashboardSideBar } from '@/components/DashboardSideBar';
import { VerifyBanner } from '@/components/VerifyBanner';
import { useInjectiveWallets } from '@/context/InjectiveWalletContext';
import { useNotifiTargetContext } from '@/context/NotifiTargetContext';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export type CardView = 'history' | 'destination' | 'alertSubscription';

export default function NotifiDashboard() {
  const searchParams = useSearchParams();
  const tempCardId = searchParams.get('cardid');
  const { cardConfig } = useNotifiTenantConfig();
  const validTempCardId = tempCardId && cardConfig.id === tempCardId;
  const [cardView, setCardView] = useState<CardView>(
    tempCardId && validTempCardId ? 'alertSubscription' : 'history',
  );
  const { unVerifiedTargets } = useNotifiTargetContext();
  const { selectedWallet, wallets } = useWallets();
  const {
    selectedWallet: selectiedInjectiveWallet,
    wallets: injectiveWallets,
  } = useInjectiveWallets();
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  if (
    (!selectedWallet || !wallets[selectedWallet].walletKeys) &&
    (!selectiedInjectiveWallet ||
      !injectiveWallets[selectiedInjectiveWallet].walletKeys)
  )
    return null;

  let accountAddress: string | undefined = '';
  if (selectedWallet) {
    accountAddress = wallets[selectedWallet].walletKeys?.bech32;
  }
  if (selectiedInjectiveWallet) {
    accountAddress =
      injectiveWallets[selectiedInjectiveWallet].walletKeys?.bech32;
  }
  if (!accountAddress) return;
  return (
    <div className="flex items-start flex-row min-h-screen">
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
        {unVerifiedTargets.length > 0 && cardView === 'history' ? (
          <VerifyBanner setCardView={setCardView} />
        ) : null}
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
