'use client';

import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
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
    popGlobalInfoModal({
      message:
        'It’s been a while. Connect to Notifi to load your notification details.',
      iconOrEmoji: { type: 'emoji', content: '👋' },
      timeout: 20000,
    });
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
