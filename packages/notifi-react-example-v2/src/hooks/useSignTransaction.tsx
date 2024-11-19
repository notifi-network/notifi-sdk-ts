import { useNotifiFrontendClientContext } from '@notifi-network/notifi-react';
import { ethers } from 'ethers';
import React from 'react';

export const useSignTransaction = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [signatureViaNotifiNonce, setSignatureViaNotifiNonce] =
    React.useState<string>();
  const { walletWithSignParams, loginViaTransaction } =
    useNotifiFrontendClientContext();

  const isSupported = [
    'SOLANA',
    // TODO: ⬇ Impl other blockchains transaction
    'ARBITRUM',
  ].includes(walletWithSignParams.walletBlockchain);

  const signTransaction = React.useCallback(async () => {
    if (!loginViaTransaction) return;
    setIsLoading(true);
    let transactionSigner = null;

    switch (walletWithSignParams.walletBlockchain) {
      case 'SOLANA':
        try {
          transactionSigner = walletWithSignParams.hardwareLoginPlugin;
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
        // TODO: WIP below
        try {
          // eslint-disable-next-line
          // @ts-ignore
          transactionSigner = window.ethereum;
          if (!transactionSigner) throw new Error('No signer - ETH');
          const accounts = await transactionSigner.request({
            method: 'eth_accounts',
            params: [],
          });

          // const memo = ethers.hexlify(
          //   ethers.toUtf8Bytes(loginViaTransaction.nonce),
          // );
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
        // TODO: Impl other blockchains transaction
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
