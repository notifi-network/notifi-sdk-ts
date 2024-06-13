import { useGlobalStateContext } from '@/context/GlobalStateContext';
import { useInjectiveWallets } from '@/context/InjectiveWalletContext';
import { useNotifiFrontendClientContext } from '@/context/NotifiFrontendClientContext';
import { FtuStage } from '@/context/NotifiUserSettingContext';
import { useNotifiUserSettingContext } from '@/context/NotifiUserSettingContext';
import { objectKeys } from '@/utils/typeUtils';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useEffect, useRef } from 'react';

import { useRouterAsync } from './useRouterAsync';

export const useNotifiRouter = (urlParams?: Record<string, string>) => {
  console.log(0, { urlParams });
  const urlParamsString = urlParams
    ? objectKeys(urlParams)
        .map((key) => `${key}=${urlParams[key]}`)
        .join('&')
    : '';
  console.log(1, { urlParamsString });
  const {
    frontendClientStatus,
    login,
    error: loginError,
    loading: isLoadingLogin,
  } = useNotifiFrontendClientContext();
  const { handleRoute, isLoadingRouter } = useRouterAsync();
  const { setIsGlobalLoading } = useGlobalStateContext();
  const { ftuStage, isLoading: isLoadingFtu } = useNotifiUserSettingContext();
  const { wallets, selectedWallet } = useWallets();
  const { wallets: injectiveWallets, selectedWallet: injectiveSelectedWallet } =
    useInjectiveWallets();
  const isLoginStarted = useRef(false);

  useEffect(() => {
    if (!frontendClientStatus.isInitialized) return;
    if (frontendClientStatus.isExpired) {
      handleRoute(
        `/notifi/expiry${urlParamsString ? `?${urlParamsString}` : ''}`,
      );
      return;
    }
    if (frontendClientStatus.isAuthenticated && !isLoadingFtu) {
      if (!ftuStage) {
        handleRoute(
          `/notifi/signup${urlParamsString ? `?${urlParamsString}` : ''}`,
        );
        return;
      }
      if (ftuStage === FtuStage.Done) {
        handleRoute(
          `/notifi/dashboard${urlParamsString ? `?${urlParamsString}` : ''}`,
        );
        return;
      } else {
        handleRoute(
          `/notifi/ftu${urlParamsString ? `?${urlParamsString}` : ''}`,
        );
        return;
      }
    }
  }, [frontendClientStatus, ftuStage, isLoadingFtu]);

  useEffect(() => {
    if (isLoginStarted.current || frontendClientStatus.isAuthenticated) return;
    setIsGlobalLoading(true);
    isLoginStarted.current = true;
    login(); // NOTE: No need handle error & loading, use isLoading & error hook instead
  }, []);

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
