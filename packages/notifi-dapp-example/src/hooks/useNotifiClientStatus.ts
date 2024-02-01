import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import { useMemo } from 'react';

export const useNotifiClientStatus = () => {
  const { frontendClient } = useNotifiClientContext();

  const { isExpired, isAuthenticated, isInitialized } = useMemo(() => {
    return {
      isExpired: frontendClient.userState?.status === 'expired',
      isAuthenticated: frontendClient.userState?.status === 'authenticated',
      isInitialized: !!frontendClient.userState,
    };
  }, [frontendClient.userState?.status]);
  return { isExpired, isAuthenticated, isInitialized };
};
