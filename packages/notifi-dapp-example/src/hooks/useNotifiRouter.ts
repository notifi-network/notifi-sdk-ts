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
  const { wallets, selectedWallet, isAuthenticationVerified } = useWallets();
  const isLoginStarted = useRef(false);

  useEffect(() => {
    console.log('in use effect in router');
    console.log('frontend client:');
    console.log(frontendClientStatus);
    console.log('ftu stage:' + ftuStage);
    console.log('isAuthenticationVerified:' + isAuthenticationVerified);
    console.log('selectedWallet: ' + selectedWallet);
    console.log('isLoadingRouter: ' + isLoadingRouter);
    if (
      !frontendClientStatus.isInitialized
      // !isAuthenticationVerified ||
      // || ftuStage === null // todo uncomment this
    )
      return;

    if (!isAuthenticationVerified && selectedWallet === 'coinbase') {
      return;
    }

    if (frontendClientStatus.isExpired) {
      handleRoute('/notifi/expiry');
      return;
    }
    if (
      frontendClientStatus.isAuthenticated &&
      // isAuthenticationVerified && //todo uncomment
      !isLoadingRouter
    ) {
      if (!isAuthenticationVerified && selectedWallet === 'coinbase') {
        return; // todo only for cbw
      }
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
  }, [
    frontendClientStatus.isAuthenticated,
    frontendClientStatus.isExpired,
    frontendClientStatus.isAuthenticated,
    ftuStage,
    isAuthenticationVerified,
  ]);

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
