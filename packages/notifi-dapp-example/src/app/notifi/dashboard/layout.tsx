'use client';

import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import {
  FtuStage,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useEffect } from 'react';

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

  return <div>{children}</div>;
}
