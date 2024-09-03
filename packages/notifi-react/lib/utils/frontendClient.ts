import {
  ConfigFactoryInput,
  NotifiEnvironment,
  NotifiFrontendClient,
  Uint8SignMessageFunction,
  WalletWithSignParams,
} from '@notifi-network/notifi-frontend-client';

import { WalletWithSignParamsModified } from '../context';

// TODO: Refactor frontendClient and import it from notifi-frontend-client
export type SolanaParams = Readonly<{
  walletBlockchain: 'SOLANA';
  walletPublicKey: string;
  signMessage: Uint8SignMessageFunction;
}>;

export type HardwareLoginPlugin = {
  // NOTE: instead of importing from notifi-solana-hw-login, we duplicate the type here (for performance reasons)
  sendMessage: (message: string) => Promise<string>;
};

export type SolanaParamsWithHardwareLoginPlugin = SolanaParams & {
  hardwareLoginPlugin: HardwareLoginPlugin;
};

export const loginViaSolanaHardwareWallet = async (
  frontendClient: NotifiFrontendClient,
  walletWithSignParams: WalletWithSignParamsModified,
) => {
  if (walletWithSignParams.walletBlockchain !== 'SOLANA')
    throw new Error('loginViaSolanaHardwareWallet: Invalid blockchain');
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
  return logInResult;
};

export const getFrontendConfigInput = (
  tenantId: string,
  params: WalletWithSignParamsModified,
  env?: NotifiEnvironment,
): ConfigFactoryInput => {
  if ('accountAddress' in params) {
    return {
      account: {
        address: params.accountAddress,
        publicKey: params.walletPublicKey,
      },
      tenantId,
      walletBlockchain: params.walletBlockchain,
      env,
    };
  } else if ('signingPubkey' in params) {
    return {
      account: {
        publicKey: params.walletPublicKey,
        delegatorAddress: params.signingPubkey,
        address: params.signingAddress,
      },
      tenantId,
      walletBlockchain: params.walletBlockchain,
      env,
    };
  } else if ('userAccount' in params) {
    return {
      account: {
        userAccount: params.userAccount,
      },
      tenantId,
      walletBlockchain: params.walletBlockchain,
      env,
    };
  } else {
    return {
      account: {
        publicKey: params.walletPublicKey,
      },
      tenantId,
      walletBlockchain: params.walletBlockchain,
      env,
    };
  }
};
