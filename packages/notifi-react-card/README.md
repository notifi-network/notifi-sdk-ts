# `@notifi-network/notifi-react-card`

> Configurable component for Notifi alerts

## Usage

```
npm install @notifi-network/notifi-react-card
npm install --save-dev @notifi-network/notifi-core
```

You can import the default stylesheet to get baseline styling.

### Solana

```tsx
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

export const Remote: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  if (publicKey === null) {
    // publicKey is required
    return null;
  }

  return (
    <NotifiContext
      dappAddress="<YOUR OWN DAPP ADDRESS HERE>"
      walletBlockchain="SOLANA"
      env="Development"
      signMessage={signMessage}
      walletPublicKey={publicKey}
      connection={connection}
      sendTransaction={sendTransaction}
    >
      <NotifiSubscriptionCard cardId="<YOUR OWN CARD ID HERE>" darkMode />
    </NotifiContext>
  );
};
```

### Ethereum

```tsx
import { arrayify } from '@ethersproject/bytes';
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useEthers } from '@usedapp/core';
import React from 'react';

export const Notifi: React.FC = () => {
  const { account, library } = useEthers();
  const signer = library?.getSigner();

  if (account === undefined || signer === undefined) {
    // account is required
    return null;
  }

  return (
    <NotifiContext
      dappAddress="<YOUR OWN DAPP ADDRESS HERE>"
      env="Development"
      signMessage={async (message: Uint8Array) => {
        const result = await signer.signMessage(message);
        return arrayify(result);
      }}
      walletPublicKey={account}
      walletBlockchain="ETHEREUM"
    >
      <NotifiSubscriptionCard cardId="<YOUR OWN CARD ID HERE>" darkMode />
    </NotifiContext>
  );
};
```

### Aptos -- Fewcha Wallet

You might have to tinker with the signMessage function, as many wallets seem to disagree on the signature to use. The below example is with Fewcha wallet

```tsx
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import React from 'react';

export const Notifi: React.FC = ({
  fewcha,
  account,
  publicKey,
}: Readonly<{
  fewcha: any; // TODO
  account: string;
  publicKey: string;
}>) => {
  return (
    <NotifiContext
      dappAddress="<YOUR OWN DAPP ADDRESS HERE>"
      env="Development"
      walletBlockchain="APTOS"
      accountAddress={account}
      walletPublicKey={publicKey}
      signMessage={async (message: string, nonce: number) => {
        const result = await fewcha.signMessage({
          address: true,
          message,
          nonce,
        });

        return result.data.signature;
      }}
    >
      <NotifiSubscriptionCard cardId="<YOUR OWN CARD ID HERE>" darkMode />
    </NotifiContext>
  );
};
```
