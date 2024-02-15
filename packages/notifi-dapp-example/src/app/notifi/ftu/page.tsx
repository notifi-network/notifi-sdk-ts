'use client';

import { ConfigAlertModal } from '@/components/ConfigAlertModal';
import { ConfigDestinationModal } from '@/components/ConfigDestinationModal';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
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

  const { cardConfig } = useNotifiCardContext();

  useEffect(() => {
    syncFtuStage(cardConfig.isContactInfoRequired);
  }, []);

  return (
    <>
      {ftuStage === FtuStage.Destination ? (
        <ConfigDestinationModal contactInfo={cardConfig.contactInfo} />
      ) : null}

      {ftuStage === FtuStage.Alerts ? <ConfigAlertModal /> : null}
    </>
  );
}
