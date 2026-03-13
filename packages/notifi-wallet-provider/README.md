# `@notifi-network/notifi-wallet-provider`

Simply wrap the React components with `NotifiWalletProvider` to utilize Notifi's supported wallets.

> [!TIP]
> Check [Typedoc](https://docs.notifi.network/notifi-sdk-ts/notifi-wallet-provider/types/Types.Wallets.html) for supported wallets and other details.

## Prerequisites

- Node.js version > 22
- React version > 17

## Installation

```bash
npm install @notifi-network/notifi-wallet-provider
```

## Usage

1. Wrap components with NotifiWalletProvider wrapper

```tsx
// ...
<NotifiWalletProvider
  walletOptions={{
    keplr: { chainId: 'injective-1' }, // Optional. Defaults to 'injective-1'. Set to your target Cosmos chain ID.
    evm: { cosmosChainPrefix: 'inj' }, // Optional. Defaults to 'inj'. Set if your EVM chain uses a Cosmos-style bech32 address prefix.
  }}
>
  <App /> {/* or components which wants to consume context */}
</NotifiWalletProvider>
// ...
```

2. Use `useWallets` hook to access wallet information

```tsx
// ...
import { useWallets } from '@notifi-network/notifi-wallet-provider';

function MyComponent() {
  const { selectWallet, selectedWallet, wallets, error, isLoading } =
    useWallets();

  useEffect(() => {
    if (error) {
      // handle error
    }
  }, [error]);

  return (
    <div>
      <div className="flex grow gap-6 px-5 justify-center items-center">
        {Object.keys(wallets)
          .filter((wallet) => wallets[wallet].isInstalled)
          .map((wallet) => {
            return (
              <button
                key={wallet}
                disabled={isLoading}
                onClick={() => {
                  wallets[wallet].connect(); // Refer to `Wallet methods` section for more supported wallet methods
                }}
              >
                <div>{wallet}</div>
              </button>
            );
          })}
      </div>
    </div>
  );
}
```

## Custom Wagmi Config

By default, this package uses a built-in WalletConnect project ID for quick setup. **This default ID is intended for development/testing only.** In production, you should use your own WalletConnect project ID to avoid potential rate limiting, quota sharing, or service disruption.

You can obtain a project ID from [Reown (WalletConnect) Dashboard](https://cloud.reown.com). For more details, refer to the [official documentation](https://docs.reown.com/cloud/relay).

Pass your own `wagmiConfig` to `NotifiWalletProvider`:

```tsx
import { createConfig, http } from 'wagmi';
import * as chains from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const myWagmiConfig = createConfig({
  chains: [chains.mainnet, chains.polygon /* ... */],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'MyApp' }),
    walletConnect({ projectId: 'YOUR_PROJECT_ID' }),
  ],
  transports: {
    [chains.mainnet.id]: http(),
    [chains.polygon.id]: http(),
  },
});

<NotifiWalletProvider wagmiConfig={myWagmiConfig}>
  <App />
</NotifiWalletProvider>;
```

## Wallet methods

- `connect` - Connect to wallet
- `disconnect` - Disconnect from wallet
- `signArbitrary` - Sign arbitrary message
