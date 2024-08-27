import {
  ConfigFactoryInput,
  NotifiEnvironment,
  NotifiFrontendClient,
  WalletWithSignParams,
} from '@notifi-network/notifi-frontend-client';

export const loginViaSolanaHardwareWallet = async (
  frontendClient: NotifiFrontendClient,
  walletWithSignParams: WalletWithSignParams,
) => {
  if (walletWithSignParams.walletBlockchain !== 'SOLANA')
    throw new Error('loginViaSolanaHardwareWallet: Only SOLANA is supported');
  if (!walletWithSignParams.hardwareLoginPlugin)
    throw new Error(
      'loginViaSolanaHardwareWallet: loginViaSolanaHardwareWallet: Missing hardwareLoginPlugin',
    );
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

// TODO: consolidate with frontendClient package
export const getFrontendConfigInput = (
  tenantId: string,
  params: WalletWithSignParams,
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
