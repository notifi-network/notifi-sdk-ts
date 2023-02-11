import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

import { useAcalaWallet } from '../AcalaWalletContextProvider';
import './MultiWalletTest.css';

export const MultiWalletTest: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  const { account: acalaAccount } = useAcalaWallet();

  if (
    publicKey === null ||
    signMessage === undefined ||
    acalaAccount === null
  ) {
    // publicKey is required
    return null;
  }

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
        multiWallet={{
          ownedWallets: [
            {
              signMessageParams: {
                walletBlockchain: 'SOLANA',
                signMessage: signMessage,
              },
              walletPublicKey: publicKey,
              accountId: publicKey,
            },
            {
              signMessageParams: {
                walletBlockchain: 'SOLANA',
                signMessage: signMessage,
              },
              walletPublicKey: publicKey,
              accountId: publicKey,
            },
            {
              signMessageParams: {
                walletBlockchain: 'SOLANA',
                signMessage: signMessage,
              },
              walletPublicKey: acalaAccount, // Should fail to sign
              accountId: acalaAccount,
            },
          ],
        }}
      >
        <NotifiSubscriptionCard
          darkMode
          cardId="7f35dd52d252453f9c89dc087fc05f13"
        />
      </NotifiContext>
    </div>
  );
};
