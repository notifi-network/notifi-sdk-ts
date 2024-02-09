import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import { useEffect, useMemo } from 'react';

import { useRouterAsync } from './useRouterAsync';

export const useNotifiRouter = () => {
  const { frontendClientStatus } = useNotifiClientContext();
  const routeAvailable = useMemo(() => {
    return frontendClientStatus.isInitialized;
  }, [frontendClientStatus]);
  const { handleRoute, isLoadingRouter } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();

  useEffect(() => {
    if (frontendClientStatus.isExpired) {
      handleRoute('/notifi/expiry');
      return;
    }
    // TODO: FTU page route
    if (frontendClientStatus.isAuthenticated) {
      handleRoute('/notifi/dashboard');
      return;
    }
    handleRoute('/notifi/signup');
    return;
  }, [frontendClientStatus]);

  useEffect(() => {
    if (isLoadingRouter || !routeAvailable) {
      return setIsGlobalLoading(true);
    }
    setIsGlobalLoading(false);
  }, [isLoadingRouter, routeAvailable]);
};
