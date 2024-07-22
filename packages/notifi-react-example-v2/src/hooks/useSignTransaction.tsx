import { useNotifiFrontendClientContext } from '@notifi-network/notifi-react';
import React from 'react';

export const useSignTransaction = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [signatureViaNotifiNonce, setSignatureViaNotifiNonce] =
    React.useState<string>();
  const {
    walletWithSignParams,
    loginViaTransaction: {
      nonce: nonceForTransactionLogin,
      login: loginViaTransaction,
    },
  } = useNotifiFrontendClientContext();

  const isSupported = ['SOLANA'].includes(
    // TODO: Impl other blockchains transaction
    walletWithSignParams.walletBlockchain,
  );

  const signTransaction = React.useCallback(async () => {
    setIsLoading(true);
    let transactionSigner = null;

    switch (walletWithSignParams.walletBlockchain) {
      case 'SOLANA':
        try {
          transactionSigner = walletWithSignParams.hardwareLoginPlugin;
          const signature = await transactionSigner?.sendMessage(
            nonceForTransactionLogin,
          );

          if (!signature) throw new Error('No signature - SOLANA');
          setSignatureViaNotifiNonce(signature);
        } catch (e) {
          console.error('Error signing SOLANA transaction', e);
        } finally {
          setIsLoading(false);
        }
        break;
      default:
        // TODO: Impl other blockchains transaction
        throw new Error('Unsupported blockchain');
    }
  }, [nonceForTransactionLogin]);

  React.useEffect(() => {
    if (!signatureViaNotifiNonce) return;
    setIsLoading(true);
    loginViaTransaction(signatureViaNotifiNonce).then(() =>
      setIsLoading(false),
    );
  }, [signatureViaNotifiNonce, loginViaTransaction]);

  return {
    isLoading,
    signTransaction,
    isSupported,
  };
};
