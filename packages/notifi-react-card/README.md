# `@notifi-network/notifi-react-card`

A drop-in component that can get your dapp up and running with alert notifications in minutes.

We currently support the following blockchains:

- Solana
- Near
- Ethereum
- Polygon
- Arbitrum
- Binance
- Aptos
- Acala

# Getting Started

Fill out [this form](https://bit.ly/NotifiDappSetup) to receive a developer login.

With a developer login, you can generate an API key and customize component configurations.

&nbsp;

# Installation

**npm**

```
npm install @notifi-network/notifi-react-card
npm install --save-dev @notifi-network/notifi-core
```

**yarn**

```
yarn add @notifi-network/notifi-react-card
yarn add --dev @notifi-network/notifi-core
```

Import the following CSS file into your component to get baseline styling:

```
import '@notifi-network/notifi-react-card/dist/index.css';
```

## Design Guidelines

We have design recommendations on how to best present the UI to your dapp users. Check them out here: [Figma](https://www.figma.com/file/ieF0Ynuc3WI608RCt7wKSf/Notifi-Template?node-id=0%3A1&t=v8zeo6UovJAOb9vR-0).

## Tutorial Video

Here is a [link](https://www.youtube.com/watch?v=LIKu-clf9bg) covering how to setup the React Card config.

The video covers the following:

- Configuring the card in our developer tool
- Adding Event Types
- Installing the react package into your project
- Updating the default values to match your dapp

#### Example tips

- Embed the bell icon by the wallet login section.
  ie. ![here](https://i.imgur.com/f2rnrpk.png)

  &nbsp;

- There should be a state for the bell icon when connected/not connected.
  ie. ![example of not connected state](https://i.imgur.com/V9yEeCj.png)
  ie. If not connected, the bell icon should be hidden.

- Make sure that there is enough contrast between color selections.

- Styling should be consistent with your current UI.

&nbsp;

# Code Examples

Please see below for code examples on the component configuration. Click on the dropdown button to check out the code snippet.

### Solana

<details>
<summary>Integrate Card Component</summary>

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

</details>

### EVM (Ethereum, Polygon, Arbitrum, or Binance)

<details>
<summary>Integrate Card Component</summary>

Note: All EVM chains use Ethers. If using a supported EVM-chain, be sure to update the `NotifiContext` params accordingly.

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
      walletBlockchain="ETHEREUM" // NOTE - Please update to the correct chain name.
      //If Polygon, use "POLYGON"
      //If Arbitrum, use "ARBITRUM"
      //If Binance, use "BINANCE"
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

</details>

### Aptos

<details>
<summary>Integrate Card Component</summary>

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

        if (typeof result === 'string') {
          return result;
        } else return result.signature;
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

</details>

### Acala

<details>
<summary>Integrate Card Component</summary>

Create a hook that gets all of the account data using Polkadot util libraries

```tsx
import { web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';

export default function useAcalaWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [acalaAddress, setAcalaAddress] = useState<string | null>(null);
  const [polkadotPublicKey, setPolkadotPublicKey] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function getAccounts() {
      const allAccounts = await web3Accounts();
      const account = allAccounts[0].address;
      if (account) setAccount(account);
    }
    getAccounts();
  }, []);

  const signMessage = useCallback(async (address: string, message: string) => {
    const extension = await web3FromAddress(address);
    const signRaw = extension?.signer?.signRaw;
    const signMessage = await signRaw({
      address,
      data: message,
      type: 'bytes',
    });
    return signMessage.signature;
  }, []);

  const getAcalaAddress = (address: string): string => {
    const publicKey = decodeAddress(address);
    return encodeAddress(publicKey, 10);
  };

  const getPolkadotPublicKey = (address: string): string => {
    const publicKey = decodeAddress(address);
    const decodedPublicKey = u8aToHex(publicKey);
    return decodedPublicKey;
  };

  useEffect(() => {
    if (account) {
      const acalaAddress = getAcalaAddress(account);
      if (acalaAddress) setAcalaAddress(acalaAddress);
      const polkadotPublicKey = getPolkadotPublicKey(account);
      if (polkadotPublicKey) setPolkadotPublicKey(polkadotPublicKey);
    }
  }, [account]);

  return { account, acalaAddress, polkadotPublicKey, signMessage };
}
```

Create a component for the Notifi React Card

```tsx
import {
  NotifiContext,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import React, { useCallback, useState } from 'react';
import { useAcalaWallet } from 'path-to-custom-hook';

export const Notifi: React.FC = () => {

  const { acoount, acalaAddress, polkadotPublicKey, signMessage } = useAcalaWallet();

  if (
    account === null ||
    acalaAddress === null ||
    polkadotPublicKey === null
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
      walletBlockchain="ACALA"
      accountAddress={acalaAddress}
      walletPublicKey={polkadotPublicKey}
      signMessage={async (accountAddress: string, message: string) => {
        await signMessage(
          address: accountAddress;
          message: message;
      );
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

</details>

### NEAR

<details>
<summary>Integrate Card Component</summary>

Create a hook that gets all of the account data using NEAR API

```tsx
import { keyStores } from 'near-api-js';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useWalletSelector } from '../components/NearWalletContextProvider';

//assume that you have NEARWalletContextProvider setup
//example: https://github.com/near/wallet-selector/blob/main/examples/react/contexts/WalletSelectorContext.tsx

export default function useNearWallet() {
  const { accountId } = useWalletSelector();
  const [walletPublicKey, setWalletPublicKey] = useState<string | null>(null);

  const config = {
    networkId: 'testnet', //adjust based on network type
  };

  const keyStore = useMemo(() => {
    return new keyStores.BrowserLocalStorageKeyStore();
  }, []);

  useEffect(() => {
    if (!accountId) {
      setWalletPublicKey(null);
    }
  }, [accountId]);

  useEffect(() => {
    async function getPublicKey() {
      const keyPair = await keyStore.getKey(config.networkId, accountId!);
      const publicKey = keyPair.getPublicKey().toString();
      // remove the ed25519: appending for the wallet public key
      const publicKeyWithoutTypeAppend = publicKey.replace('ed25519:', '');
      setWalletPublicKey(publicKeyWithoutTypeAppend);
    }
    getPublicKey();
  }, [accountId, config.networkId, keyStore]);

  const signMessage = useCallback(
    async (message: Uint8Array) => {
      const keyPair = await keyStore.getKey(config.networkId, accountId!);
      const { signature } = keyPair.sign(message);
      return signature;
    },
    [accountId, config.networkId, keyStore],
  );

  return { account: accountId, walletPublicKey, signMessage };
}
```

Create a component for the Notifi React Card

```tsx
import {
  NotifiContext,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useNearWallet } from 'path-to-custom-hook';
import React, { useCallback, useState } from 'react';

export const Notifi: React.FC = () => {
  const { account, walletPublicKey, signMessage } = useNearWallet();

  if (account === null || walletPublicKey === null) {
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
      walletBlockchain="NEAR"
      accountAddress={account}
      walletPublicKey={walletPublicKey} // require wallet public key without ed25519: append
      signMessage={signMessage}
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

</details>
