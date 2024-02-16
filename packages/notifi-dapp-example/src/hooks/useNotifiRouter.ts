import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiCardContext } from '@/context/notifi/NotifiCardContext';
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
  const { setIsGlobalLoading, seIisInitialized, isInitialized } =
    useGlobalStateContext();

  const { ftuStage, syncFtuStage } = useNotifiSubscriptionContext();

  const { cardConfig } = useNotifiCardContext();
  useEffect(() => {
    seIisInitialized('initializing');
    if (frontendClientStatus.isAuthenticated) {
      syncFtuStage(cardConfig.isContactInfoRequired).finally(() => {
        seIisInitialized('initialized');
      });
    }
    seIisInitialized('initialized');
  }, [
    frontendClientStatus.isAuthenticated,
    cardConfig.isContactInfoRequired,
    syncFtuStage,
  ]);

  useEffect(() => {
    if (isInitialized !== 'initialized') {
      return;
    }
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
  }, [frontendClientStatus, syncFtuStage, ftuStage, isInitialized]);

  useEffect(() => {
    if (isLoadingRouter || !routeAvailable) {
      return setIsGlobalLoading(true);
    }
    setIsGlobalLoading(false);
  }, [isLoadingRouter, routeAvailable]);
};
