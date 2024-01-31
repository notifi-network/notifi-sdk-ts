import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiTenantConfig } from '@/context/NotifiTenantConfigContext';
import {
  FtuStage,
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '@notifi-network/notifi-react-card';
import { useEffect, useMemo } from 'react';

import { useRouterAsync } from './useRouterAsync';

export const useNotifiRouter = () => {
  const { frontendClientStatus } = useNotifiClientContext();
  const routeAvailable = useMemo(() => {
    return frontendClientStatus.isInitialized;
  }, [frontendClientStatus]);
  const { handleRoute, isLoadingRouter } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();

  const { ftuStage, syncFtuStage } = useNotifiSubscriptionContext();
  const { cardConfig } = useNotifiTenantConfig();
  useEffect(() => {
    if (frontendClientStatus.isAuthenticated) {
      syncFtuStage(cardConfig.isContactInfoRequired);
    }
  }, [
    frontendClientStatus.isAuthenticated,
    cardConfig.isContactInfoRequired,
    syncFtuStage,
    setIsGlobalLoading,
  ]);

  useEffect(() => {
    if (frontendClientStatus.isExpired) {
      handleRoute('/notifi/expiry');
      return;
    }
    if (frontendClientStatus.isAuthenticated) {
      if (ftuStage === FtuStage.Done) {
        handleRoute('/notifi/dashboard');
        return;
      } else {
        handleRoute('/notifi/ftu');
        return;
      }
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
