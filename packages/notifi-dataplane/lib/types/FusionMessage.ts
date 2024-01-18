
export interface FusionMessage {
  eventTypeId: string,
  variablesJson: any,
  specificWallets?: ReadonlyArray<
    Readonly<{
      walletPublicKey: string;
      // NOTE: Blockchain duplicated here because there would be a circular reference otherwise
      walletBlockchain: | 'SOLANA'
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
      | 'ZKSYNC';
    }>
  >,
}