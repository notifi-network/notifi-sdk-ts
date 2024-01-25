export interface FusionMessage {
  eventTypeId: string;
  variablesJson: any;
  specificWallets?: ReadonlyArray<
    Readonly<{
      [walletAddress in string]: | 'SOLANA'
      | 'ETHEREUM'
      | 'AVALANCHE'
      | 'APTOS'
      | 'ACALA'
      | 'POLYGON'
      | 'ARBITRUM'
      | 'BINANCE'
      | 'NEAR'
      | 'OPTIMISM'
      | 'INJECTIVE'
      | 'OSMOSIS'
      | 'NIBIRU'
      | 'SUI'
      | 'ZKSYNC'
    }>
  >;
}
