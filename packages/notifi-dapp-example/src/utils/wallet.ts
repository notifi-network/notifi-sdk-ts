import {
  isBtcBlockchain,
  isCosmosBlockchain,
  isEvmBlockchain,
  isSolanaBlockchain,
} from '@notifi-network/notifi-frontend-client';
import { Types as GqlTypes } from '@notifi-network/notifi-graphql';
import { Types as WalletTypes } from '@notifi-network/notifi-wallet-provider';

export function convertWalletName(walletName: string) {
  switch (walletName) {
    case 'metamask':
      return 'MetaMask';
    case 'keplr':
      return 'Keplr';
    case 'leap':
      return 'Leap Wallet';
    case 'phantom':
      return 'Phantom';
    case 'coinbase':
      return 'Coinbase Wallet';
    case 'rabby':
      return 'Rabby';
    case 'rainbow':
      return 'Rainbow';
    case 'zerion':
      return 'Zerion';
    case 'okx':
      return 'OKX';
    case 'walletconnect':
      return 'Wallet Connect';
    case 'binance':
      return 'Binance';
    default:
      return walletName;
  }
}

export const getAccountAddress = (
  blockchainType: GqlTypes.BlockchainType,
  keys: WalletTypes.WalletKeys,
) => {
  if (!keys) return null;
  if (isEvmBlockchain(blockchainType) && 'hex' in keys) {
    return keys.hex?.toLowerCase();
  }
  if (isSolanaBlockchain(blockchainType) && 'base58' in keys) {
    return keys.base58;
  }
  if (isBtcBlockchain(blockchainType) && 'base58' in keys) {
    return keys.base58;
  }
  if (isCosmosBlockchain(blockchainType) && 'bech32' in keys) {
    return keys.bech32;
  }
  return null;
};
