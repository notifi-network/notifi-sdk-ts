'use client';

import { ConfigAlertModal } from '@/components/ConfigAlertModal';
import { ConfigDestinationModal } from '@/components/ConfigDestinationModal';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiTenantConfigContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import { useEffect } from 'react';

export default function NotifiFTU() {
  const {
    frontendClientStatus: { isInitialized },
  } = useNotifiFrontendClientContext();

  if (!isInitialized) return null;

  const { handleRoute } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();

  const { cardConfig } = useNotifiTenantConfigContext();
  const { ftuStage } = useNotifiUserSettingContext();

  if (!cardConfig) {
    return null;
  }

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
