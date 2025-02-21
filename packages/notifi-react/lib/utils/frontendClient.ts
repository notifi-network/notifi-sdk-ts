import {
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

  const transactionSignature = await plugin.signTransaction(nonce);

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
