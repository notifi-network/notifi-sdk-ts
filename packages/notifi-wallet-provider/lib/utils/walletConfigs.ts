export const BLOCKCHAIN_WALLETS = {
  evm: [
    'metamask',
    'coinbase',
    'rabby',
    'walletconnect',
    'okx',
    'rainbow',
    'zerion',
    'binance',
  ] as const,
  solana: ['phantom'] as const,
  cosmos: ['keplr'] as const,
  cardano: ['lace', 'eternl', 'nufi', 'okx-cardano', 'yoroi', 'ctrl'] as const,
} as const;

export const INTEGRATION_WALLETS = {
  injected: [
    'metamask',
    'okx',
    'zerion',
    'rabby',
    'rainbow',
    'binance',
  ] as const,
  wagmi: ['walletconnect', 'coinbase'] as const,
  native: [
    'keplr',
    'phantom',
    'lace',
    'eternl',
    'nufi',
    'okx-cardano',
    'yoroi',
    'ctrl',
  ] as const,
} as const;
