import {
  NotifiContext,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

import './NotifiCard.css';

export const NotifiCard: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  if (publicKey === null || signMessage === undefined) {
    // publicKey is required
    return null;
  }

  const inputLabels = {
    email: 'Email',
    sms: 'Text Message',
    telegram: 'Telegram',
  };

  const inputSeparators: NotifiInputSeparators = {
    smsSeparator: {
      content: 'OR',
    },
    emailSeparator: {
      content: 'OR',
    },
    telegramSeparator: {
      content: 'OR',
    },
  };

  return (
    <div className="container">
      <NotifiContext
        dappAddress="junitest.xyz"
        walletBlockchain="SOLANA"
        env="Development"
        walletPublicKey={publicKey}
        connection={connection}
        sendTransaction={sendTransaction}
        signMessage={signMessage}
      >
        <NotifiSubscriptionCard
          darkMode
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          cardId="71562316475a4171ae9c980adaefab7d"
        ></NotifiSubscriptionCard>
      </NotifiContext>
    </div>
  );
};
