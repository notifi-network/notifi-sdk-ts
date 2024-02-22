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
  const { setGlobalError } = useGlobalStateContext();
  const login = useFrontendClientLogin();
  useEffect(() => {
    if (!frontendClientStatus.isExpired) {
      handleRoute('/notifi');
    }
    // TODO: rewrite global error which allows passing a timeout and emoji icon (design TBD)
    setGlobalError(
      'It’s been a while. Connect to Notifi to load your notification details.',
    );
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
