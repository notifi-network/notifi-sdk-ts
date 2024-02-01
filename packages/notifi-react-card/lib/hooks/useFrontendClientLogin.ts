import { Types } from '@notifi-network/notifi-graphql';
import { useCallback } from 'react';

import {
  useNotifiClientContext,
  useNotifiSubscriptionContext,
} from '../context';

export const useFrontendClientLogin = () => {
  const { params, frontendClient, updateFrontendClientStatus } =
    useNotifiClientContext();

  const { useHardwareWallet } = useNotifiSubscriptionContext();

  const logIn = useCallback(async (): Promise<Types.UserFragmentFragment> => {
    if (useHardwareWallet && params.walletBlockchain === 'SOLANA') {
      const plugin = params.hardwareLoginPlugin;
      const { nonce } = await frontendClient.beginLoginViaTransaction({
        walletAddress: params.walletPublicKey,
        walletBlockchain: params.walletBlockchain,
      });

      const transactionSignature = await plugin.sendMessage(nonce);

      const logInResult = await frontendClient.completeLoginViaTransaction({
        walletAddress: params.walletPublicKey,
        walletBlockchain: params.walletBlockchain,
        transactionSignature,
      });

      if (logInResult?.completeLogInByTransaction === undefined) {
        throw new Error('Log in failed');
      }
      updateFrontendClientStatus();
      return logInResult.completeLogInByTransaction;
    } else {
      const result = await frontendClient.logIn(params);
      updateFrontendClientStatus();
      return result;
    }
  }, [useHardwareWallet, frontendClient, params]);

  return logIn;
};
