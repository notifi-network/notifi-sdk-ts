import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useMemo } from 'react';

import { useAcalaWallet } from '../AcalaWalletContextProvider';
import './MultiWalletTest.css';

export const MultiWalletTest: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  const {
    account: acalaAccount,
    requestSignature,
    polkadotPublicKey,
  } = useAcalaWallet();

  const hwLoginPlugin = useMemo(() => {
    return new MemoProgramHardwareLoginPlugin({
      walletPublicKey: publicKey ?? '',
      connection,
      sendTransaction,
    });
  }, [publicKey, connection, sendTransaction]);

  if (
    publicKey === null ||
    signMessage === undefined ||
    acalaAccount === null ||
    polkadotPublicKey === null
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
        hardwareLoginPlugin={hwLoginPlugin}
        signMessage={signMessage}
        multiWallet={{
          ownedWallets: [
            {
              walletBlockchain: 'SOLANA',
              signMessage,
              walletPublicKey: publicKey,
            },
            {
              walletBlockchain: 'ACALA',
              signMessage: requestSignature,
              walletPublicKey: polkadotPublicKey,
              accountAddress: acalaAccount,
            },
          ],
        }}
      >
        <NotifiSubscriptionCard
          darkMode
          cardId="dc08714b8b014ee79aec3ea650e34091"
        />
      </NotifiContext>
    </div>
  );
};
