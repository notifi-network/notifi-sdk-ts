'use client';

import { ConfigAlertModal } from '@/components/ConfigAlertModal';
import { ConfigDestinationModal } from '@/components/ConfigDestinationModal';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import { FtuStage } from '@/context/NotifiUserSettingContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useEffect } from 'react';

export default function NotifiFTU() {
  const {
    frontendClientStatus: { isInitialized },
  } = useNotifiFrontendClientContext();

  if (!isInitialized) return null;

  const { handleRoute } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();

  const { cardConfig } = useNotifiTenantConfig();
  const { ftuStage } = useNotifiUserSettingContext();

  useEffect(() => {
    setIsGlobalLoading(true);
    if (ftuStage === FtuStage.Done) {
      handleRoute('/notifi/dashboard').finally(() => setIsGlobalLoading(false));
      return;
    }
    setIsGlobalLoading(false);
  }, [ftuStage]);

  if (ftuStage !== FtuStage.Destination && ftuStage !== FtuStage.Alerts) {
    return null;
  }
  return (
    <>
      {ftuStage === FtuStage.Destination ? (
        <ConfigDestinationModal contactInfo={cardConfig.contactInfo} />
      ) : null}

      {ftuStage === FtuStage.Alerts ? <ConfigAlertModal /> : null}
    </>
  );
}
