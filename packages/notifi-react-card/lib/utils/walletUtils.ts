import { Types } from '@notifi-network/notifi-graphql';

export const walletToSourceType = (
  wallet: Types.ConnectedWallet,
): Types.CreateSourceInput['type'] => {
  switch (wallet?.walletBlockchain) {
    case 'ACALA':
      return 'ACALA_WALLET';
    case 'APTOS':
      return 'APTOS_WALLET';
    case 'ARBITRUM':
      return 'ARBITRUM_WALLET';
    case 'AVALANCHE':
      return 'AVALANCHE_WALLET';
    case 'BINANCE':
      return 'BINANCE_WALLET';
    case 'ETHEREUM':
      return 'ETHEREUM_WALLET';
    case 'POLYGON':
      return 'POLYGON_WALLET';
    case 'SOLANA':
      return 'SOLANA_WALLET';
    case 'OPTIMISM':
      return 'OPTIMISM_WALLET';
    case 'SUI':
      return 'SUI_WALLET';
    case 'ZKSYNC':
      return 'ZKSYNC_WALLET';
    default:
      throw new Error('Unsupported walletType');
  }
};

export const walletToSourceAddress = (
  wallet: Types.ConnectedWalletFragmentFragment,
): Types.CreateSourceInput['blockchainAddress'] => {
  if (wallet?.address === null) {
    throw new Error('Invalid connected wallet');
  }
  return wallet?.address;
};

export const walletToSource = (
  wallet: Types.ConnectedWalletFragmentFragment,
): Types.CreateSourceInput => {
  const sourceAddress = walletToSourceAddress(wallet);
  const sourceType = walletToSourceType(wallet);

  return {
    name: `${sourceType} ${sourceAddress}`,
    blockchainAddress: sourceAddress,
    type: sourceType,
  };
};
