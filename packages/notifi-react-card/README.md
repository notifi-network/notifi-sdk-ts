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
import type { MessageSigner } from '@notifi-network/notifi-core';
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

export const Remote: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, sendTransaction } = useWallet();
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
      signer={adapter as MessageSigner}
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

There are some transitive (unused) dependencies on Solana -- it's possible to work around by passing undefined for these things. (We are working on cleaning these up)

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
      signer={{
        signMessage: async (message: Uint8Array) => {
          const result = await signer.signMessage(message);
          return arrayify(result);
        },
      }}
      walletPublicKey={account}
      walletBlockchain="ETHEREUM"
      connection={undefined as any}
      sendTransaction={undefined as any}
    >
      <NotifiSubscriptionCard cardId="<YOUR OWN CARD ID HERE>" darkMode />
    </NotifiContext>
  );
};
```

### Solana
