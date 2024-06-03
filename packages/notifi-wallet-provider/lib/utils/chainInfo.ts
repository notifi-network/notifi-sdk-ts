import { AddEthereumChainParameter } from 'viem';

import { AvailableChains } from '../context/NotifiWallets';

export const getChainInfoByName = (
  chainName: AvailableChains,
): AddEthereumChainParameter => {
  switch (chainName) {
    case 'polygon':
      return {
        chainId: '0x89',
        chainName: 'Polygon',
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.ankr.com/polygon'],
        blockExplorerUrls: ['https://polygonscan.com/'],
      };
    case 'arbitrum':
      return {
        chainId: '0xa4b1',
        chainName: 'Arbitrum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://rpc.ankr.com/arbitrum'],
        blockExplorerUrls: ['https://arbiscan.io/'],
      };
    // case 'injective':
    //   return {
    //     chainId: '0x9dd', // Adjusted to reflect the correct chain ID for Injective
    //     chainName: 'Injective',
    //     nativeCurrency: {
    //       name: 'Injective',
    //       symbol: 'INJ',
    //       decimals: 18,
    //     },
    //     rpcUrls: ['https://mainnet.rpc.inevm.com/http'],
    //     blockExplorerUrls: ['https://explorer.injective.network'], // Updated block explorer URL
    //   };
    case 'injective':
    case 'ethereum':
      return {
        chainId: '0x1',
        chainName: 'Ethereum',
        nativeCurrency: {
          name: 'Ether',
          symbol: 'ETH',
          decimals: 18,
        },
        rpcUrls: ['https://mainnet.infura.io/v3/'],
        blockExplorerUrls: ['https://etherscan.io/'],
      };
    default:
      throw new Error(`Unsupported Chain: ${chainName}`);
  }
};
