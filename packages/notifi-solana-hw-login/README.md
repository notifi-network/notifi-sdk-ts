# Notifi Solana Hardware Login Plugin

This package is a requirement for users integrating `@notifi/notifi-react` with the Solana blockchain. It provides the bindings necessary for logging in with a Solana hardware wallet. Example below:

```tsx
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';

// ...

<NotifiContextProvider
  // other props
  hardwareLoginPlugin={solanaHardwareLoginPlugin} // If your dapp wants to support Solana hardware wallets, add this prop
>
  {/* Your components here */}
</NotifiContextProvider>;
```

For more comprehensive examples, see the `notifi-react-example-v2` package's [NotifiContextWrapper.tsx](https://github.com/notifi-network/notifi-sdk-ts/blob/97280b625ef133811d176fbb8add73f6b3f7bd44/packages/notifi-react-example-v2/src/context/NotifiContextWrapper.tsx#L184)
