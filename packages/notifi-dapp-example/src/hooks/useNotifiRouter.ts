import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { FtuStage } from '@/context/NotifiUserSettingContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';
import { useEffect, useMemo } from 'react';

import { useRouterAsync } from './useRouterAsync';

export const useNotifiRouter = () => {
  const { frontendClientStatus } = useNotifiFrontendClientContext();
  const routeAvailable = useMemo(() => {
    return frontendClientStatus.isInitialized;
  }, [frontendClientStatus]);
  const { handleRoute, isLoadingRouter } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { ftuStage } = useNotifiUserSettingContext();

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
