import { useNotifiFrontendClientContext } from '@notifi-network/notifi-react';
import React from 'react';

export const useSignTransaction = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [signatureViaNotifiNonce, setSignatureViaNotifiNonce] =
    React.useState<string>();
  const { walletWithSignParams, loginViaTransaction } =
    useNotifiFrontendClientContext();

  const isSupported = ['SOLANA', 'ARBITRUM'].includes(
    walletWithSignParams.walletBlockchain,
  );

  const signTransaction = React.useCallback(async () => {
    if (!loginViaTransaction) return;
    setIsLoading(true);
    let transactionSigner = null;

    switch (walletWithSignParams.walletBlockchain) {
      case 'SOLANA':
        try {
          transactionSigner = walletWithSignParams.hardwareLoginPlugin;

          if (!transactionSigner) throw new Error('No signer - SOLANA');

          if (!transactionSigner.sendMessage) {
            throw new Error(
              'Transaction signer does not have sendMessage method',
            );
          }
          const signature = await transactionSigner?.sendMessage(
            loginViaTransaction.nonce,
          );

          if (!signature) throw new Error('No signature - SOLANA');
          setSignatureViaNotifiNonce(signature);
        } catch (e) {
          console.error('Error signing SOLANA transaction', e);
        } finally {
          setIsLoading(false);
        }
        break;
      case 'ARBITRUM':
        /* NOT SUPPORTED YET */
        try {
          transactionSigner = window.ethereum;
          if (!transactionSigner) throw new Error('No signer - ETH');
          const accounts = await transactionSigner.request({
            method: 'eth_accounts',
            params: [],
          });

          const signature = await transactionSigner.request({
            method: 'eth_sendTransaction',
            params: [
              {
                from: accounts[0],
                to: accounts[0],
                value: '1',
                gasLimit: '0x5028',
                maxPriorityFeePerGas: '0x3b9aca00', // 1 Gwei
                maxFeePerGas: '0x2540be400', // 1 Gwei
                data: loginViaTransaction.nonce,
              },
            ],
          });
          setSignatureViaNotifiNonce(signature);
        } catch (e) {
          console.error('Error signing ETHEREUM transaction', e);
        } finally {
          setIsLoading(false);
        }
        break;
      default:
        /*  Impl other blockchains transaction */
        throw new Error('Unsupported blockchain');
    }
  }, [loginViaTransaction?.nonce]);

  React.useEffect(() => {
    if (!signatureViaNotifiNonce || !loginViaTransaction) return;
    setIsLoading(true);
    loginViaTransaction.login(signatureViaNotifiNonce).finally(() => {
      setSignatureViaNotifiNonce(undefined);
      setIsLoading(false);
    });
  }, [signatureViaNotifiNonce, loginViaTransaction?.nonce]);

  return {
    isLoading,
    signTransaction,
    isSupported,
  };
};
