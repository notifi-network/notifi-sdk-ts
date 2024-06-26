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
    case 'BASE':
      return 'BASE_WALLET';
    case 'BLAST':
      return 'BLAST_WALLET';
    case 'CELO':
      return 'CELO_WALLET';
    case 'THE_ROOT_NETWORK':
      return 'THE_ROOT_NETWORK';
    case 'INJECTIVE':
      return 'INJECTIVE_WALLET';
    case 'LINEA':
      return 'LINEA_WALLET';
    case 'MANTA':
      return 'MANTA_WALLET';
    case 'MANTLE':
      return 'MANTLE_WALLET';
    case 'MONAD':
      return 'MONAD_WALLET';
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
    case 'ARCHWAY':
      return 'ARCHWAY_WALLET';
    case 'ELYS':
      return 'ELYS_WALLET';
    case 'NEUTRON':
      return 'NEUTRON_WALLET';
    case 'BERACHAIN':
      return 'BERACHAIN_WALLET';
    case 'AXELAR':
      return 'AXELAR_WALLET';
    case 'XION':
      return 'XION_WALLET';
    case 'AGORIC':
      return 'AGORIC_WALLET';
    case 'ORAI':
      return 'ORAI_WALLET';
    case 'KAVA':
      return 'KAVA_WALLET';
    case 'CELESTIA':
      return 'CELESTIA_WALLET';
    case 'COSMOS':
      return 'COSMOS_WALLET';
    case 'DYMENSION':
      return 'DYMENSION_WALLET';
    case 'PERSISTENCE':
      return 'PERSISTENCE_WALLET';
    case 'DYDX':
      return 'DYDX_WALLET';
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
