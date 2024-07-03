import { NotifiFrontendClient } from '@notifi-network/notifi-frontend-client';
import React from 'react';

import { WalletWithSignParams } from '../context';

export const useHardwareWallet = (
  walletWithSignParams: WalletWithSignParams,
) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const login = async (frontendClient: NotifiFrontendClient | null) => {
    if (walletWithSignParams.walletBlockchain !== 'SOLANA' || !frontendClient)
      return;
    const plugin = walletWithSignParams.hardwareLoginPlugin;
    const { nonce } = await frontendClient.beginLoginViaTransaction({
      walletAddress: walletWithSignParams.walletPublicKey,
      walletBlockchain: walletWithSignParams.walletBlockchain,
    });

    const transactionSignature = await plugin.sendMessage(nonce);

    const logInResult = await frontendClient.completeLoginViaTransaction({
      walletAddress: walletWithSignParams.walletPublicKey,
      walletBlockchain: walletWithSignParams.walletBlockchain,
      transactionSignature,
    });

    if (logInResult?.completeLogInByTransaction === undefined) {
      throw new Error('Log in failed');
    }
    return frontendClient;
  };
  return {
    isLoading,
    error,
    login,
  };
};
