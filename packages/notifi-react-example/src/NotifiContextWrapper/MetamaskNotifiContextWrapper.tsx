import { WalletBlockchain } from '@notifi-network/notifi-core';
import { Uint8SignMessageFunction } from '@notifi-network/notifi-frontend-client';
import { NotifiContext } from '@notifi-network/notifi-react-card';
import { arrayify } from 'ethers/lib/utils.js';
import { PropsWithChildren, useMemo } from 'react';
import {
  useAccount,
  useConnect,
  useNetwork,
  useSignMessage,
  useSwitchNetwork,
} from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

enum SupportedEvmChains {
  ETHEREUM = 1,
  BINANCE = 56,
  AVALANCHE = 43114,
  ARBITRUM = 42161,
  POLYGON = 137,
  OPTIMISM = 10,
  ZKSYNC = 324,
}

const supportedEvmChains = [
  SupportedEvmChains.ETHEREUM,
  SupportedEvmChains.BINANCE,
  SupportedEvmChains.AVALANCHE,
  SupportedEvmChains.ARBITRUM,
  SupportedEvmChains.POLYGON,
  SupportedEvmChains.OPTIMISM,
  SupportedEvmChains.ZKSYNC,
];

export const MetamaskNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const tenantId = process.env.REACT_APP_TENANT_ID;
  const env = process.env.REACT_APP_ENV;
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const { switchNetwork } = useSwitchNetwork();

  const walletBlockchain: WalletBlockchain = useMemo(() => {
    switch (chain?.id) {
      case SupportedEvmChains.ETHEREUM:
        return 'ETHEREUM';
      case SupportedEvmChains.BINANCE:
        return 'BINANCE';
      case SupportedEvmChains.AVALANCHE:
        return 'AVALANCHE';
      case SupportedEvmChains.ARBITRUM:
        return 'ARBITRUM';
      case SupportedEvmChains.POLYGON:
        return 'POLYGON';
      case SupportedEvmChains.OPTIMISM:
        return 'OPTIMISM';
      case SupportedEvmChains.ZKSYNC:
        return 'ZKSYNC';
      default:
        return 'ETHEREUM';
    }
  }, [chain]);

  const signMessage: Uint8SignMessageFunction = async (message: Uint8Array) => {
    const result = await signMessageAsync({ message });
    return arrayify(result);
  };

  if (!chain?.network) {
    return (
      <div>
        <button onClick={() => connect()} disabled={isConnected}>
          {isConnected ? `${address}` : 'Connect Wallet'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <select
        value={chain.id}
        onChange={(e) => switchNetwork?.(Number(e?.target?.value) ?? 1)}
      >
        {supportedEvmChains.map((chainId) => (
          <option key={chainId} value={chainId}>
            {chainId}
          </option>
        ))}
      </select>
      {chain && <div>Connected Chain: {walletBlockchain}</div>}
      <button onClick={() => connect()} disabled={isConnected}>
        {isConnected ? `${address}` : 'Connect Wallet'}
      </button>

      {isConnected && chain?.network ? (
        <NotifiContext
          dappAddress={tenantId}
          env={env}
          signMessage={signMessage}
          walletPublicKey={address ?? ''}
          walletBlockchain={walletBlockchain}
        >
          {children}
        </NotifiContext>
      ) : null}
    </div>
  );
};
