import type { InjectedExtension } from '@polkadot/extension-dapp';

declare global {
  interface Window {
    injectedWeb3?: InjectedExtension;
  }
}
