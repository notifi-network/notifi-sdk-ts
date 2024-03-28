'use client';

import { ConfigAlertModal } from '@/components/ConfigAlertModal';
import { ConfigDestinationModal } from '@/components/ConfigDestinationModal';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import {
  FtuStage,
  useNotifiTenantConfig,
} from '@/context/NotifiTenantConfigContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import { useEffect } from 'react';

export default function NotifiFTU() {
  const {
    frontendClientStatus: { isInitialized },
  } = useNotifiClientContext();

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
