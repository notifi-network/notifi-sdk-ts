# `@notifi-network/notifi-wallet-provider`

Simply wrap the React components with `NotifiWalletProvider` to utilize Notifi's supported wallets.

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
//...
<NotifiWalletProvider>
  <App /> {/* or components which wants to consume context */}
</NotifiWalletProvider>
// ...
```

2. Use `useWallet` hook to access wallet information

```tsx
// ...
import { useWallet } from '@notifi-network/notifi-wallet-provider';

function MyComponent() {
  const { selectWallet, selectedWallet, wallets, error, isLoading } =
    useWallet();

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

## Wallet methods

- `connect` - Connect to wallet
- `disconnect` - Disconnect from wallet
- `signArbitrary` - Sign arbitrary message
