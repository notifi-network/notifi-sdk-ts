import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useInjectiveWallets } from '@/context/InjectiveWalletContext';
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { FtuStage } from '@/context/NotifiUserSettingContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useEffect, useRef } from 'react';

import { useRouterAsync } from './useRouterAsync';

export const useNotifiRouter = () => {
  const {
    frontendClientStatus,
    login,
    error: loginError,
    loading: isLoadingLogin,
  } = useNotifiFrontendClientContext();
  const { handleRoute, isLoadingRouter } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { ftuStage } = useNotifiUserSettingContext();
  const { wallets, selectedWallet } = useWallets();
  const { wallets: injectiveWallets, selectedWallet: injectiveSelectedWallet } =
    useInjectiveWallets();
  const isLoginStarted = useRef(false);

  useEffect(() => {
    if (!frontendClientStatus.isInitialized) return;
    if (frontendClientStatus.isExpired) {
      handleRoute('/notifi/expiry');
      return;
    }
    if (frontendClientStatus.isAuthenticated) {
      if (!ftuStage) {
        handleRoute('/notifi/signup');
        return;
      }
      if (ftuStage === FtuStage.Done) {
        handleRoute('/notifi/dashboard');
        return;
      } else {
        handleRoute('/notifi/ftu');
        return;
      }
    }

    if (isLoginStarted.current) return;
    setIsGlobalLoading(true);
    isLoginStarted.current = true;
    login(); // NOTE: No need handle error & loading, use isLoading & error hook instead
  }, [frontendClientStatus, ftuStage]);

  useEffect(() => {
    if (loginError) {
      handleRoute('/');
      if (selectedWallet) {
        wallets[selectedWallet].disconnect();
      } else if (injectiveSelectedWallet) {
        injectiveWallets[injectiveSelectedWallet].disconnect();
      }
    }
  }, [loginError]);

  useEffect(() => {
    console.log({ isLoadingLogin });
    if (isLoadingRouter || isLoadingLogin) {
      return setIsGlobalLoading(true);
    }
    setIsGlobalLoading(false);
  }, [isLoadingRouter, isLoadingLogin]);
};
