// import {
//   NotifiFrontendClient,
//   SIGNING_MESSAGE,
//   WalletWithSignParams,
// } from '@notifi-network/notifi-frontend-client';

// export const loginViaSolanaHardwareWallet = async (
//   frontendClient: NotifiFrontendClient,
//   walletWithSignParams: WalletWithSignParams,
// ) => {
//   if (walletWithSignParams.walletBlockchain !== 'SOLANA')
//     throw new Error('loginViaSolanaHardwareWallet: Only SOLANA is supported');
//   if (!walletWithSignParams.hardwareLoginPlugin)
//     throw new Error(
//       'loginViaSolanaHardwareWallet: loginViaSolanaHardwareWallet: Missing hardwareLoginPlugin',
//     );
//   const plugin = walletWithSignParams.hardwareLoginPlugin;
//   console.log(0);
//   const { nonce } = await frontendClient._beginLogInWithWeb3({
//     walletPubkey: walletWithSignParams.walletPublicKey,
//     authType: 'SOLANA_HARDWARE_SIGN_MESSAGE',
//     authAddress: walletWithSignParams.walletPublicKey,
//   });

//   const signedMessage = `${SIGNING_MESSAGE}${nonce}`;
//   const transactionSignature = await plugin.signTransaction(nonce);

//   const logInResult = await frontendClient.completeLogInWithWeb3({
//     nonce: nonce,
//     signedMessage: signedMessage,
//     signature: transactionSignature,
//     signingAddress: walletWithSignParams.walletPublicKey,
//     signingPubkey: walletWithSignParams.walletPublicKey,
//   });

//   if (logInResult?.completeLogInWithWeb3 === undefined) {
//     throw new Error('Log in via Web3 failed');
//   }
//   return logInResult;
// };
