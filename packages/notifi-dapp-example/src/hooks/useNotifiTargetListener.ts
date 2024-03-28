import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { useNotifiTargetContext } from '@/context/NotifiTargetContext';
import { useEffect } from 'react';

export const useNotifiTargetListener = () => {
  const {
    frontendClient,
    frontendClientStatus: { isInitialized, isAuthenticated },
  } = useNotifiFrontendClientContext();

  const { refreshTargetDocument } = useNotifiTargetContext();

  useEffect(() => {
    const handler = () => {
      if (!isInitialized || !isAuthenticated) {
        return;
      }
      return frontendClient.fetchData().then(refreshTargetDocument);
    };

    window.addEventListener('focus', handler);
    return () => {
      window.removeEventListener('focus', handler);
    };
  }, [isInitialized, isAuthenticated, frontendClient]);
};
