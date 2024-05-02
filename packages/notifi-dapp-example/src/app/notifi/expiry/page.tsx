'use client';

import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useNotifiFrontendClientContext } from '@notifi-network/notifi-react';
import { useEffect } from 'react';

export default function NotifiExpiry() {
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const { popGlobalInfoModal } = useGlobalStateContext();
  const { login, frontendClientStatus } = useNotifiFrontendClientContext();
  useEffect(() => {
    if (!frontendClientStatus.isExpired) {
      handleRoute('/notifi');
      return;
    }
    // comment this out as we decide to remove the reminder right now
    // popGlobalInfoModal({
    //   message:
    //     'It’s been a while. Connect to Notifi to load your notification details.',
    //   iconOrEmoji: { type: 'emoji', content: '👋' },
    //   timeout: 20000,
    // });
  }, [frontendClientStatus]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <EcosystemHero
        isLoading={isLoadingRouter}
        cta={() => login().then(() => popGlobalInfoModal(null))}
        ctaButtonText="Connect Wallet To Start"
      />
      <DummyAlertsModal />
    </div>
  );
}
