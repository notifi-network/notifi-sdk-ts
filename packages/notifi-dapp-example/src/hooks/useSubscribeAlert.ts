import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
import { FusionToggleEventTypeItem } from '@notifi-network/notifi-frontend-client';
import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useCallback, useMemo, useState } from 'react';

export const useSubscribeAlert = (eventType: FusionToggleEventTypeItem) => {
  const { inputs } = useNotifiCardContext();
  const { frontendClient } = useNotifiClientContext();
  const { render, alerts } = useNotifiSubscriptionContext();
  const [isLoading, setIsLoading] = useState(false);
  const { setGlobalError } = useGlobalStateContext();

  const subscribeAlert = useCallback(() => {
    setIsLoading(true);
    frontendClient
      .ensureAlert({ eventType, inputs })
      .then(() => {
        frontendClient.fetchData().then(render);
      })
      .catch((e) => {
        setGlobalError(
          'ERROR: Fail to subscribe alert, see console for more details.',
        );
        console.log(e);
      })
      .finally(() => setIsLoading(false));
  }, [frontendClient]);

  const unsubscribeAlert = useCallback(() => {
    setIsLoading(true);
    const alert = alerts[eventType.name];
    if (!alert) return;
    frontendClient
      .deleteAlert({ id: alert.id })
      .then(() => {
        frontendClient.fetchData().then(render);
      })
      .catch((e) => {
        setGlobalError(
          'ERROR: Fail to unsubscribe alert, see console for more details.',
        );
        console.log(e);
      })
      .finally(() => setIsLoading(false));
  }, [alerts, eventType, frontendClient]);

  const isAlertSubscribed = useMemo(() => {
    return Object.keys(alerts).includes(eventType.name);
  }, [alerts, eventType]);

  return {
    isLoading,
    subscribeAlert,
    unsubscribeAlert,
    isAlertSubscribed,
  };
};
