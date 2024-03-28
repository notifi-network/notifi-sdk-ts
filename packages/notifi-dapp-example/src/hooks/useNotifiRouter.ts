import { useGlobalStateContext } from '@/context/GlobalStateContext';
import {
  FtuStage, // useNotifiTenantConfig,
} from '@/context/NotifiTenantConfigContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';
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
  const { ftuStage } = useNotifiUserSettingContext();
  // const { ftuStage } = useNotifiTenantConfig();

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
