# `@notifi-network/notifi-react-card`

A drop-in component that can get your dapp up and running with alert notifications in minutes.

We currently support the following blockchains:

- Solana
- Near
- Ethereum
- Polygon
- Arbitrum
- Binance
- Optimism
- Aptos
- Acala
- Injective
- Sui

# Getting Started

## Register for a Notifi tenant

Head over [Notifi Admin Panel(AP)](https://admin.dev.notifi.network) to create a new developer account(tenant) and [set up](https://youtu.be/fxgl97NgpvY) the first notifi card.

Remember the credential `dappAddress` (or `tenantId`) and `cardId` for the [up-coming steps](#embedding-the-card-component).

## SDK (`notifi-react-card`) Installation

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

## Styling the Card Component

1. Adopting notifi default card css by `import '@notifi-network/notifi-react-card/dist/index.css';` globally in dapp (ex `index.tsx` or `App.tsx`)

2. In order to customize card style, you can create a new global .css file (ex `NotifiCard.css`) to override the [default style](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-card/lib/components/defaults.css) with its corresponding class name.

## Embedding the Card Component

Please see below for code examples on the component configuration. Click on the dropdown button to check out the code snippet.

### Solana

<details>
<summary>Integrate Card Component -- for Solana, you will also need to install `@notifi-network/notifi-solana-hw-login`</summary>

```tsx
import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React from 'react';

import './NotifiCard.css';

export const NotifiCard: React.FC = () => {
  const { connection } = useConnection();
  const { wallet, sendTransaction, signMessage } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  const hwLoginPlugin = useMemo(() => {
    return new MemoProgramHardwareLoginPlugin({
      walletPublicKey: publicKey ?? '',
      connection,
      sendTransaction,
    });
  }, [publicKey, connection, sendTransaction]);

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

  return (
    <div className="container">
      <NotifiContext
        dappAddress="<YOUR OWN DAPP ADDRESS HERE>"
        walletBlockchain="SOLANA"
        env="Development"
        walletPublicKey={publicKey}
        hardwareLoginPlugin={hwLoginPlugin}
        signMessage={signMessage}
      >
        <NotifiSubscriptionCard
          darkMode
          inputLabels={inputLabels}
          inputSeparators={inputSeparators}
          cardId="<YOUR OWN CARD ID HERE>"
        />
      </NotifiContext>
    </div>
  );
};
```

</details>

### EVM (Ethereum, Polygon, Arbitrum, Avalanche or Binance)

<details>
<summary>Integrate Card Component</summary>

Note: All EVM chains use Ethers. If using a supported EVM-chain, be sure to update the `NotifiContext` params accordingly.

Note: Last tested with =>

    "@usedapp/core": "^1.2.5"

    "ethers": "^5.7.2"

```tsx
import { arrayify } from '@ethersproject/bytes';
import {
  NotifiContext,
  NotifiInputFieldsText,
  NotifiInputSeparators,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useEthers } from '@usedapp/core';
import { providers } from 'ethers';
import React, { useMemo } from 'react';

export const Notifi: React.FC = () => {
  const { account, library } = useEthers();
  const signer = useMemo(() => {
    if (library instanceof providers.JsonRpcProvider) {
      return library.getSigner();
    }
    return undefined;
  }, [library]);

  if (account === undefined || signer === undefined) {
    // account is required
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
      //If Optimism, use OPTIMISM
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
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import {
  NotifiContext,
  NotifiInputFieldsText,
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

        if (result === null) {
          throw new Error('failed to sign');
        }

        if (Array.isArray(result.signature)) {
          return result.signature[0];
        }
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

</details>

### Acala

<details>
<summary>Integrate Card Component</summary>

Create a hook that gets all of the account data using Polkadot util libraries

```tsx
import { web3Accounts, web3FromAddress } from '@polkadot/extension-dapp';
import { stringToHex } from '@polkadot/util';

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
    const data = stringToHex(message);
    const signMessage = await signRaw({
      address,
      data,
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
  NotifiInputFieldsText,
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

### Injective

<details>
<summary>Integrate Card Component</summary>

```tsx
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import React, { useMemo } from 'react';

import { useKeplrContext } from '../KeplrWalletProvider';
import './NotifiCard.css';

export const KeplrConnectButton: React.FC = () => {
  const { key, connect } = useKeplrContext();
  return (
    <button onClick={connect}>
      {key !== undefined ? key.bech32Address : 'Connect'}
    </button>
  );
};

export const KeplrCard: React.FC = () => {
  const { key, signArbitrary } = useKeplrContext();
  const keyBase64 = useMemo(
    () =>
      key !== undefined
        ? Buffer.from(key.pubKey).toString('base64')
        : undefined,
    [key],
  );

  return (
    <div className="container">
      <h1>Notifi Card: Injective (Keplr)</h1>
      <KeplrConnectButton />
      {key !== undefined && keyBase64 !== undefined ? (
        <NotifiContext
          dappAddress="junitest.xyz"
          walletBlockchain="INJECTIVE"
          env="Development"
          walletPublicKey={keyBase64}
          accountAddress={key.bech32Address}
          signMessage={async (message: Uint8Array): Promise<Uint8Array> => {
            const result = await signArbitrary(
              'injective-1',
              key.bech32Address,
              message,
            );
            return Buffer.from(result.signature, 'base64');
          }}
        >
          NotifiSubscriptionCard
          <NotifiSubscriptionCard
            darkMode
            inputs={{ userWallet: key.bech32Address }}
            cardId="d8859ea72ff4449fa8f7f293ebd333c9"
          />
        </NotifiContext>
      ) : null}
    </div>
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
  NotifiInputFieldsText,
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

### WalletConnect (Cross-chain wallet adaptor)

<details>
<summary>Integrate Card Component</summary>

Note:

- Ethers.js & wagmi are used. Be sure these two are installed as dependencies.
- `NotifiContext` params needs to be updated accordingly.

Create a WallectConnectProvider by WagmiConfig

```tsx
import { FC, PropsWithChildren } from 'react';
import { WagmiConfig, configureChains, createClient, mainnet } from 'wagmi';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { infuraProvider } from 'wagmi/providers/infura';

export const connector = new WalletConnectConnector({
  chains: [mainnet],
  options: {
    projectId: '<YOUR WALLETCONNECT PROJECT ID HERE>', // Get Project ID at https://cloud.walletconnect.com/
  },
});

export const WalletConnectProvider: FC<PropsWithChildren> = ({ children }) => {
  const { provider } = configureChains(
    [mainnet],
    [infuraProvider({ apiKey: '<YOUR INFURA API KEY HERE>' })], // Get Infura apiKey at https://www.infura.io/
  );
  const client = createClient({
    autoConnect: true,
    connectors: [connector],
    provider: provider,
  });
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
};
```

Wrap the React </App> with <WalletConnectProvider />

```tsx
...
const container = document.getElementById('root');
if (container != null) {
  const root = ReactDOMClient.createRoot(container);
  root.render(
    <React.StrictMode>
      ...
        <WalletConnectProvider>
            <App />
        </WalletConnectProvider>
      ...
    </React.StrictMode>,
  );
}
```

Place the NotifiSubscriptionCard by passing in corresponding NotifiContext properties

```tsx
import { connector } from '<PATH TO WalletConnectorProvider.tsx>';
import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import { arrayify } from 'ethers/lib/utils.js';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

export const WalletConnectCard = () => {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: connector,
  });
  const { disconnect } = useDisconnect();

  const { signMessageAsync } = useSignMessage();
  return (
    <NotifiContext
      dappAddress="<YOUR OWN DAPP ADDRESS HERE>"
      env="Development" // or "Production"
      signMessage={async (message) => {
        const result = await signMessageAsync({ message });
        return arrayify(result);
      }}
      walletPublicKey={address ?? ''}
      walletBlockchain="ETHEREUM"
    >
      <NotifiSubscriptionCard
        cardId="<YOUR OWN CARD ID HERE>"
        darkMode //optional
      />
    </NotifiContext>
  );
};
```

</details>

### Sui

<details>
<summary>Integrate Card Component</summary>

> [`ethos-connect`](https://www.npmjs.com/package/ethos-connect) are used as Sui wallet adaptor. Be sure it is installed as dependencies.

```bash
npm install ethos-connect # For npm
yarn add ethos-connect # For yarn
```

1. Create a EthosWalletProvider component

```tsx
// EthosWalletProvider.tsx
import { EthosConnectProvider } from 'ethos-connect';
import { PropsWithChildren } from 'react';

export const EthosWalletProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <EthosConnectProvider
      ethosConfiguration={{
        hideEmailSignIn: true, // defaults to false
      }}
    >
      {children}
    </EthosConnectProvider>
  );
};
```

2. Wrap the React </App> with <EthosWalletProvider />

```tsx
import { EthosWalletProvider } from '<PATH TO EthosWalletProvider.tsx>';
<EthosWalletProvider></App> <EthosWalletProvider />
```

3. Place the NotifiSubscriptionCard by passing in corresponding NotifiContext properties

```tsx
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
          dappAddress="< YOUR OWN DAPP ADDRESS HERE >"
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
            cardId="< YOUR OWN CARD ID HERE >"
            onClose={() => alert('nope you must stay')}
          />
        </NotifiContext>
      ) : (
        <SignInButton>CONNECT SUI WALLET</SignInButton>
      )}
    </div>
  );
};
```

</details>

# Tutorial Video and example

Check out the [tutorial video](https://youtu.be/fxgl97NgpvY) for a step-by-step guide on how to integrate the Notifi Card into your dapp. It covers:

- Configure the card in [Notifi Admin Panel(AP)](https://admin.dev.notifi.network)
- Set up Event Types
- Install the SDK (`notifi-react-card`) and required dependencies
- Configure the credentials (`dappAddress`, `cardId`) in SDK to get the card working

For more integration examples, clone [`notifi-react-example`](https://github.com/notifi-network/notifi-sdk-ts/tree/main/packages/notifi-react-example) repo and try it out.
