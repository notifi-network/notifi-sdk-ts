import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiIntercomCard,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import React, { useMemo } from 'react';

import './NotifiCard.css';

export const SolanaCard: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  const hwLoginPlugin = useMemo(() => {
    return new MemoProgramHardwareLoginPlugin({
      walletPublicKey: publicKey ?? '',
      connection,
      sendTransaction,
    });
  }, [publicKey, connection, sendTransaction]);

  const inputLabels: NotifiInputFieldsText = {
    label: {
      email: 'Email',
      sms: 'Text Message',
      telegram: 'Telegram',
    },
    placeholderText: {
      email: 'Email',
    },
  };

  const inputSeparators: NotifiInputSeparators = {
    smsSeparator: {
      content: '',
    },
    emailSeparator: {
      content: '',
    },
  };

  const intercomInputSeparators: NotifiInputSeparators = {
    emailSeparator: {
      content: '',
    },
  };

  return (
    <div className="container">
      <h1>Notifi Card: Solana</h1>
      {publicKey && signMessage ? (
        <NotifiContext
          dappAddress="junitest.xyz"
          walletBlockchain="SOLANA"
          env="Development"
          walletPublicKey={publicKey}
          hardwareLoginPlugin={hwLoginPlugin}
          signMessage={signMessage}
        >
          <WalletDisconnectButton />
          NotifiSubscriptionCard
          <NotifiSubscriptionCard
            darkMode
            inputs={{ userWallet: publicKey }}
            inputLabels={inputLabels}
            inputSeparators={inputSeparators}
            cardId="d8859ea72ff4449fa8f7f293ebd333c9"
            onClose={() => alert('nope you must stay')}
            copy={{
              FetchedStateCard: {
                SubscriptionCardV1: {
                  signUpHeader: 'Please sign up',
                  EditCard: {
                    AlertListPreview: {
                      description:
                        'Get your alerts here!!! you can subscribe to any of the following:',
                    },
                  },
                },
              },
            }}
          />
          NotifiIntercomCard
          <NotifiIntercomCard
            darkMode
            inputLabels={inputLabels}
            inputSeparators={intercomInputSeparators}
            cardId="1045f61752b148eabab0403c08cd60b2"
          />
        </NotifiContext>
      ) : (
        <WalletMultiButton />
      )}
    </div>
  );
};
