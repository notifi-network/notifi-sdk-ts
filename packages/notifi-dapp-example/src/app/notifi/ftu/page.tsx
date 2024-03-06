'use client';

import { ConfigAlertModal } from '@/components/ConfigAlertModal';
import { ConfigDestinationModal } from '@/components/ConfigDestinationModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import {
  FtuStage,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useEffect } from 'react';

export default function NotifiFTU() {
  const {
    frontendClientStatus: { isInitialized },
  } = useNotifiClientContext();

  if (!isInitialized) return null;

  const { ftuStage, syncFtuStage } = useNotifiSubscriptionContext();
  const { handleRoute } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();

  const { cardConfig } = useNotifiCardContext();

  useEffect(() => {
    setIsGlobalLoading(true);
    syncFtuStage(cardConfig.isContactInfoRequired).finally(() => {
      if (ftuStage === FtuStage.Done) {
        handleRoute('/notifi/dashboard').finally(() =>
          setIsGlobalLoading(false),
        );
        return;
      }
      setIsGlobalLoading(false);
    });
  }, [ftuStage]);

  if (ftuStage !== FtuStage.Destination && ftuStage !== FtuStage.Alerts) {
    return <LoadingSpinner />;
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
