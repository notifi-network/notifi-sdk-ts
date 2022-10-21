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
  NotifiInputSeparators,
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
  };

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
      <NotifiSubscriptionCard
        cardId="<YOUR OWN CARD ID HERE>"
        inputLabels={inputLabels}
        inputSeparators={inputSeparators}
        darkMode
      />
    </NotifiContext>
  );
};
```

### Ethereum

```tsx
import { arrayify } from '@ethersproject/bytes';
import {
  NotifiContext,
  NotifiInputSeparators,
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
  };

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
      <NotifiSubscriptionCard
        cardId="<YOUR OWN CARD ID HERE>"
        inputLabels={inputLabels}
        inputSeparators={inputSeparators}
        darkMode
      />
    </NotifiContext>
  );
};
```

### Aptos

```tsx
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import {
  NotifiContext,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import React from 'react';

export const Notifi: React.FC = () => {
  const { signMessage, account } = useWallet();

  if (
    account === null ||
    account.address === null ||
    account.publicKey === null
  ) {
    // account is required
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
  };

  return (
    <NotifiContext
      dappAddress="<YOUR OWN DAPP ADDRESS HERE>"
      env="Development"
      walletBlockchain="APTOS"
      accountAddress={account.address.toString()}
      walletPublicKey={account.publicKey.toString()}
      signMessage={async (message: string, nonce: number) => {
        const result = await signMessage({
          address: true,
          message,
          nonce: `${nonce}`,
        });

        return result.signature;
      }}
    >
      <NotifiSubscriptionCard
        cardId="<YOUR OWN CARD ID HERE>"
        inputLabels={inputLabels}
        inputSeparators={inputSeparators}
        darkMode
      />
    </NotifiContext>
  );
};
```
