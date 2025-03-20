# @notifi-network/notifi-react-wallet-target-plugin

A plugin for `@notifi-network/notifi-react` that enables advanced wallet-based notification targets.

This package provides the `NotifiContextProviderWithWalletTargetPlugin` context component, allowing seamless integration of Wallet Target functionality into Notifi’s React context system. By utilizing the `toggleTargetAvailability.wallet` prop within `NotifiTargetContext`, you can dynamically enable or disable wallet-based targeting at runtime and leverage the plugin’s capabilities.

## Important Note

This package is a plugin for `@notifi-network/notifi-react` and cannot be used independently. Ensure that you have `@notifi-network/notifi-react` installed before integrating this plugin.

## Key Benefits

- Maintains the same interface style as `notifi-react`, ensuring minimal changes when integrating.
- Modular design allows developers to opt-in only if Wallet Target functionality is needed.
- Works alongside the primary `NotifiContextProvider`, adding a specialized layer for detecting and handling Wallet Target contexts.
- Provides flexibility: use the core package for standard notification flows or extend with this plugin for wallet-based targeting.

## Usage (with @notifi-network/notifi-react)

Below is a minimal example demonstrating how to replace the standard Notifi provider with the plugin-based provider:

```tsx
import { NotifiContextProviderWithWalletTargetPlugin } from '@notifi-network/notifi-react-wallet-target-plugin';
import React from 'react';

function App() {
  return (
    <NotifiContextProviderWithWalletTargetPlugin
    /* Same props as NotifiContextProvider */
    >
      {/* Include Notifi features like NotifiCardModal or custom forms here */}
      {children}
    </NotifiContextProviderWithWalletTargetPlugin>
  );
}

export default App;
```

When `toggleTargetAvailability.wallet` is set to `true`, the plugin enables wallet-specific notification targets (e.g., Coinbase). To utilize this functionality, ensure your app is wrapped with `NotifiContextProviderWithWalletTargetPlugin` instead of the standard `NotifiContextProvider` when wallet targeting is required.

## Additional Configuration

This plugin is powered by `@xmtp-react-sdk`, which requires requires specific configuration to handle the `wasm` file.
The following configuration is required in nextjs (the recommended framework).

- **Nextjs version 14.2.0 or above**

  ```js
  nextConfig = {
    experimental: {
      serverComponentsExternalPackages: [
        '@xmtp/user-preferences-bindings-wasm',
      ],
    },
  };

  // ...other configs
  ```

- **Nextjs version below 14.2.0**

  It requires manual copy of the wasm file to the server chunk folder. We will need to grab the `user_preferences_bindings_wasm_bg.wasm` file from [@xmtp/user-preferences-bindings-wasm
  ](https://www.npmjs.com/package/@xmtp/user-preferences-bindings-wasm) npm package: `Code > dist > bundler > user_preferences_bindings_wasm_bg.wasm`. And put it in the `public/wasm` directory. Then add the following configuration in the `next.config.js` file.

  ```js
  nextConfig = {
    ...nextConfig,
    webpack: (config) => {
      config.plugins.push(
        new CopyPlugin({
          patterns: [{ from: 'public/wasm', to: './server/chunks' }],
        }),
      );
      return config;
    },
  };
  // ...other configs
  ```

The projects might encounter the following error if the above configuration is not set up properly.

```bash
Error: ENOENT: no such file or directory, open '/path/to/project/.next/server/vendor-chunks/user_preferences_bindings_wasm_bg.wasm'
```

> Reference:
>
> - [official xmpt example](https://github.com/xmtp/xmtp-web/blob/main/examples/nextjs/next.config.mjs)
> - [Notifi React Example config](https://github.com/notifi-network/notifi-sdk-ts/blob/main/packages/notifi-react-example-v2/next.config.mjs)

## Advanced Usage

Instead of using `NotifiContextProviderWithWalletTargetPlugin`, which wraps `NotifiContextProvider`, you can use `NotifiWalletTargetContext` independently. This is useful when integrating `NotifiWalletTargetContext` into a different part of your app or pairing it with another context provider.

```tsx
import { NotifiTargetContextProvider } from '@notifi-network/notifi-react';
import { NotifiWalletTargetContext } from '@notifi-network/notifi-react-wallet-target-plugin';

// ... other imports

function App() {
  return (
    <NotifiWalletTargetContext {...props}>
      <NotifiTargetContextProvider toggleTargetAvailability={{ wallet: true }}>
        {/* Add Notifi components like NotifiCardModal or custom forms here */}
        {children}
      </NotifiTargetContextProvider>
    </NotifiWalletTargetContext>
  );
}
```

This approach gives you more flexibility in managing notification contexts within your application.
