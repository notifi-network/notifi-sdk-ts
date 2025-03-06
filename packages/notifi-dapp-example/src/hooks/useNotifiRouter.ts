import { useGlobalStateContext } from '@/context/GlobalStateContext';
import {
  FtuStage,
  useNotifiFrontendClientContext,
  useNotifiUserSettingContext,
} from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useEffect, useRef } from 'react';

import { useRouterAsync } from './useRouterAsync';

export const useNotifiRouter = () => {
  const {
    frontendClientStatus,
    login,
    error: loginError,
    isLoading: isLoadingLogin,
  } = useNotifiFrontendClientContext();
  const { handleRoute, isLoadingRouter } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { ftuStage, isLoading: isLoadingFtu } = useNotifiUserSettingContext();
  const { wallets, selectedWallet } = useWallets();
  const isLoginStarted = useRef(false);

  useEffect(() => {
    if (!frontendClientStatus.isInitialized) return;
    if (frontendClientStatus.isExpired) {
      handleRoute('/notifi/expiry');
      return;
    }
    if (frontendClientStatus.isAuthenticated && !isLoadingFtu) {
      if (ftuStage === FtuStage.Done) {
        handleRoute('/notifi/dashboard');
        return;
      } else {
        handleRoute('/notifi/ftu');
        return;
      }
    }
  }, [frontendClientStatus, ftuStage, isLoadingFtu]);

  useEffect(() => {
    if (isLoginStarted.current || frontendClientStatus.isAuthenticated) return;
    isLoginStarted.current = true;
    login(); // NOTE: No need handle error & loading, use isLoading & error hook instead
  }, []);

  useEffect(() => {
    if (loginError) {
      if (selectedWallet) {
        wallets[selectedWallet].disconnect();
      }
      handleRoute('/');
    }
  }, [loginError]);

  useEffect(() => {
    if (!frontendClientStatus.isAuthenticated) return setIsGlobalLoading(false);
    if (isLoadingRouter || isLoadingLogin) {
      return setIsGlobalLoading(true);
    }
    setIsGlobalLoading(false);
  }, [isLoadingRouter, isLoadingLogin, frontendClientStatus]);
};
