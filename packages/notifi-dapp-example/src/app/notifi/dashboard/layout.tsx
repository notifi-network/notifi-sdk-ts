'use client';

import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useRouterAsync } from '@/hooks/useRouterAsync';
// import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import {
  FtuStage,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useEffect, useMemo } from 'react';

export default function NotifiDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ftuStage, syncFtuStage } = useNotifiSubscriptionContext();
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { handleRoute } = useRouterAsync();
  const { cardConfig } = useNotifiCardContext();
  useNotifiRouter();

  useEffect(() => {
    setIsGlobalLoading(true);
    syncFtuStage(cardConfig.isContactInfoRequired).finally(() => {
      if (ftuStage !== FtuStage.Done) {
        handleRoute('/notifi/ftu').finally(() => setIsGlobalLoading(false));
        return;
      }
      setIsGlobalLoading(false);
    });
  }, [ftuStage]);

  if (ftuStage !== FtuStage.Done) {
    return null;
  }

  // const { frontendClient } = useNotifiClientContext();

  // const { isClientInitialized, isClientAuthenticated } = useMemo(() => {
  //   return {
  //     isClientInitialized: !!frontendClient?.userState,
  //     isClientAuthenticated:
  //       frontendClient?.userState?.status === 'authenticated',
  //   };
  // }, [frontendClient?.userState?.status]);

  // const { render } = useNotifiSubscriptionContext();

  // useEffect(() => {
  //   const handler = () => {
  //     // Ensure target is up-to-date after user returns to tab from 3rd party verification site
  //     if (!isClientInitialized || !isClientAuthenticated) {
  //       return;
  //     }
  //     return frontendClient.fetchData().then(render);
  //   };

  //   window.addEventListener('focus', handler);
  //   console.log('event');
  //   return () => {
  //     window.removeEventListener('focus', handler);
  //   };
  // }, [isClientInitialized, isClientAuthenticated, frontendClient]);

  return <div>{children}</div>;
}
