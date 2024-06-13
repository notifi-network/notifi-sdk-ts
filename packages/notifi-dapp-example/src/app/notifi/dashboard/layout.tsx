'use client';

import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import { FtuStage } from '@/context/NotifiUserSettingContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';
import { useNotifiRouter } from '@/hooks/useNotifiRouter';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function NotifiDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { handleRoute } = useRouterAsync();
  const { ftuStage } = useNotifiUserSettingContext();
  const { cardConfig } = useNotifiTenantConfig();
  const searchParams = useSearchParams();
  const tempCardId = searchParams.get('cardid');
  const validTempCardId = tempCardId && cardConfig.id === tempCardId;
  useNotifiRouter(validTempCardId ? { cardid: tempCardId } : undefined);

  useEffect(() => {
    setIsGlobalLoading(true);
    if (ftuStage !== FtuStage.Done) {
      handleRoute(
        `/notifi/ftu${validTempCardId ? `?cardid=${tempCardId}` : ''}`,
      ).finally(() => setIsGlobalLoading(false));
      return;
    }
    setIsGlobalLoading(false);
  }, [ftuStage]);

  if (ftuStage !== FtuStage.Done) {
    return null;
  }

  return <div>{children}</div>;
}
