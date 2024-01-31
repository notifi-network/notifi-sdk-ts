import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useEffect } from 'react';

export const useNotifiTargetListener = () => {
  const {
    frontendClient,
    frontendClientStatus: { isInitialized, isAuthenticated },
  } = useNotifiClientContext();

  const { render } = useNotifiSubscriptionContext();

  useEffect(() => {
    const handler = () => {
      if (!isInitialized || !isAuthenticated) {
        return;
      }
      return frontendClient.fetchData().then(render);
    };

    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('focus', handler);
    };
  }, [isInitialized, isAuthenticated, frontendClient]);
};
