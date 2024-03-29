'use client';

import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { FtuStage } from '@/context/NotifiTenantConfigContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useEffect } from 'react';

export default function NotifiDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { handleRoute } = useRouterAsync();
  const { ftuStage } = useNotifiUserSettingContext();
  useNotifiRouter();

  useEffect(() => {
    setIsGlobalLoading(true);
    if (ftuStage !== FtuStage.Done) {
      handleRoute('/notifi/ftu').finally(() => setIsGlobalLoading(false));
      return;
    }
    setIsGlobalLoading(false);
  }, [ftuStage]);

  if (ftuStage !== FtuStage.Done) {
    return null;
  }

  return <div>{children}</div>;
}
