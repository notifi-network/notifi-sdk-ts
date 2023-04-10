import { Uint8SignMessageFunction } from '@notifi-network/notifi-core';
import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import { EthosConnectStatus, SignInButton, ethos } from 'ethos-connect';
import React from 'react';

export const SuiNotifiCard: React.FC = () => {
  const { status, wallet } = ethos.useWallet();

  const signMessage: Uint8SignMessageFunction = async (message: Uint8Array) => {
    if (!wallet) {
      throw new Error('Wallet not connected');
    }

    const signature = await wallet.signMessage({
      message,
    });

    const signatureBuffer = Buffer.from(signature.signature);
    return signatureBuffer;
  };

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

  return (
    <div className="container">
      <h1>Notifi Card: Sui</h1>
      {status === EthosConnectStatus.Connected && wallet ? (
        <NotifiContext
          dappAddress="junitest.xyz"
          walletBlockchain="SUI"
          env="Development"
          accountAddress={wallet.address}
          walletPublicKey={wallet.address}
          signMessage={signMessage}
        >
          Connected SUI Wallet: <br /> {wallet?.address}
          <button onClick={wallet.disconnect}> DISCONNECT</button>
          <NotifiSubscriptionCard
            darkMode
            inputs={{ userWallet: wallet.address }}
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
        </NotifiContext>
      ) : (
        <SignInButton>CONNECT SUI WALLET</SignInButton>
      )}
    </div>
  );
};
