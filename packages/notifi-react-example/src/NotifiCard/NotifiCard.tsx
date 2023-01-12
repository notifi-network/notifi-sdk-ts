import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiIntercomCard,
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
      content: 'OR',
    },
    emailSeparator: {
      content: 'OR',
    },
    telegramSeparator: {
      content: 'OR',
    },
  };

  const intercomInputSeparators: NotifiInputSeparators = {
    emailSeparator: {
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
          cardId="7f35dd52d252453f9c89dc087fc05f13"
        />
        <NotifiIntercomCard
          darkMode
          inputLabels={inputLabels}
          inputSeparators={intercomInputSeparators}
          cardId="1045f61752b148eabab0403c08cd60b2"
        />
      </NotifiContext>
    </div>
  );
};
