# `@notifi-network/notifi-react-card`

> Configurable component for Notifi alerts

## Usage

```
npm install @notifi-network/notifi-react-card
npm install --save-dev @notifi-network/notifi-core
```

You can import the default stylesheet to get baseline styling.
Be sure to get your DAPP ID here: https://bit.ly/NotifiDappSetup

## Video

Here is a [link](https://www.youtube.com/watch?v=LIKu-clf9bg) covering how to setup the React Card Config.

The video covers the following:

- Configuring the card
- Adding Event Types
- Installing the react package into your project
- Updating the default values to match your dapp.
-

### Design Guidelines

We have general guidelines that we like to follow. You can see them here: [Figma](https://www.figma.com/file/ieF0Ynuc3WI608RCt7wKSf/Notifi-Template?node-id=0%3A1&t=v8zeo6UovJAOb9vR-0).

###### Example tips

- Embed the bell icon by the wallet login section.
  ie. ![here](https://i.imgur.com/f2rnrpk.png)
- There should be a state for the bell icon when connected/not connected.
  ie. ![example of not connected state](https://i.imgur.com/V9yEeCj.png)
  ie. If not connected, the bell icon should be hidden.
- Make sure that there is enough contrast between color selections.
- Styling should be consistent with your current UI.

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
        darkMode //optional
      />
    </NotifiContext>
  );
};
```

### Ethereum OR Polygon

Note: Polygon also uses ethers, so if using polygon be sure to update the `NotifiContext` params accordingly.

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
      ßß
      walletBlockchain="ETHEREUM" // NOTE, if using polygon be sure to use POLYGON
    >
      <NotifiSubscriptionCard
        cardId="<YOUR OWN CARD ID HERE>"
        inputLabels={inputLabels}
        inputSeparators={inputSeparators}
        darkMode //optional
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
        darkMode //optional
      />
    </NotifiContext>
  );
};
```
