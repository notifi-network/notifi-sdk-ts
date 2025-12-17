export type IntegrationMethod = 'injected' | 'wagmi' | 'native' | 'abstraxion';

export const BLOCKCHAIN_WALLETS = {
  evm: [
    'metamask',
    'coinbase',
    'rabby',
    'walletconnect',
    'okx',
    'rainbow',
    'zerion',
  ] as const,
  solana: ['phantom'] as const,
  cosmos: ['keplr'] as const,
  binance: ['binance'] as const,
  xion: ['xion'] as const,
  cardano: ['lace', 'eternl', 'nufi', 'okx-cardano', 'yoroi', 'ctrl'] as const,
} as const;

export const INTEGRATION_WALLETS = {
  injected: ['metamask', 'okx', 'zerion', 'rabby', 'rainbow'] as const,
  wagmi: ['walletconnect', 'coinbase'] as const,
  native: [
    'binance',
    'keplr',
    'phantom',
    'lace',
    'eternl',
    'nufi',
    'okx-cardano',
    'yoroi',
    'ctrl',
  ] as const,
  abstraxion: ['xion'] as const,
} as const;

export type InjectedWalletName = (typeof INTEGRATION_WALLETS.injected)[number];
export type WagmiWalletName = (typeof INTEGRATION_WALLETS.wagmi)[number];
