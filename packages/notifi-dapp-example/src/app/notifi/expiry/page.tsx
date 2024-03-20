'use client';

import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import {
  useFrontendClientLogin,
  useNotifiClientContext,
} from '@notifi-network/notifi-react-card';
import { useEffect } from 'react';

export default function NotifiExpiry() {
  const { frontendClientStatus } = useNotifiClientContext();
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const { popGlobalInfoModal } = useGlobalStateContext();
  const login = useFrontendClientLogin();
  useEffect(() => {
    if (!frontendClientStatus.isExpired) {
      popGlobalInfoModal({
        message:
          'It’s been a while. Connect to Notifi to load your notification details.',
        iconOrEmoji: { type: 'emoji', content: '👋' },
        timeout: 20000,
      });
      handleRoute('/notifi');
    }
  }, [frontendClientStatus]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <EcosystemHero
        isLoading={isLoadingRouter}
        cta={login}
        ctaButtonText="Connect Wallet To Start"
      />
      <DummyAlertsModal />
    </div>
  );
}
