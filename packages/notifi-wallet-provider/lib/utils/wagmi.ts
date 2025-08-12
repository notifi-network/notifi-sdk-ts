import { createConfig, http } from 'wagmi';
import * as chains from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

/* Currently supported EVM chains by Notifi */
// TODO: Allow users to pass in their own chains
const notifiEvmChains = [
  chains.mainnet,
  chains.polygon,
  chains.avalanche,
  chains.arbitrum,
  chains.bsc,
  // chains.botanix, // Wagmi does not support yet
  chains.bob,
  // chains.monad, // Wagmi does not support yet
  chains.base,
  chains.blast,
  chains.celo,
  chains.mantle,
  chains.scroll,
  chains.linea,
  chains.manta,
  chains.berachain,
  chains.unichain,
  chains.optimism,
  chains.root,
  chains.sei,
  chains.sonic,
  chains.ink,
  chains.swellchain,
  // chains.rome, // Wagmi does not support yet
  chains.zksync,
] as Parameters<typeof createConfig>[0]['chains'];

export const config = createConfig({
  chains: notifiEvmChains,
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Notifi' }), // TODO: Allow users to pass in their own appName
    walletConnect({
      projectId: '632a105feb9cf8380428a4f240eb6f13', // TODO: Allow users to pass in their own projectId
      qrModalOptions: {
        explorerExcludedWalletIds: 'ALL',
        enableExplorer: false,
      },
    }),
  ],
  transports: Object.fromEntries(
    notifiEvmChains.map((chain) => [chain.id, http()]),
  ),
});
