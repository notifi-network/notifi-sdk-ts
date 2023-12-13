import { WalletBlockchain } from '@notifi-network/notifi-core';
import { newFrontendClient } from '@notifi-network/notifi-frontend-client';
import { NotifiContext } from '@notifi-network/notifi-react-card';
import { arrayify } from 'ethers/lib/utils.js';
import { PropsWithChildren, useEffect, useMemo } from 'react';
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

const tenantId = 'junitest.xyz';
const env = 'Development';

export const MetamaskNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const { switchNetwork } = useSwitchNetwork();

  const walletBlockchain: WalletBlockchain | undefined = useMemo(() => {
    if (!chain?.id) return;
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
        throw new Error('Unsupported network');
    }
  }, [chain]);

  const signMessage = async (message: Uint8Array) => {
    const result = await signMessageAsync({ message });
    return arrayify(result);
  };

  useEffect(() => {
    // Re-login on chain switch to get the updated BE state
    if (!walletBlockchain || !address) return;
    const configInput = {
      account: {
        publicKey: address,
      },
      tenantId,
      walletBlockchain,
      env,
    };
    // @ts-ignore (ignore the non-evm chain types), use switch case to handle all chains for real
    const frontendClient = newFrontendClient(configInput);
    frontendClient.initialize().then((userState) => {
      if (userState?.status !== 'authenticated' || !chain?.id) return;
      frontendClient.logIn({
        walletBlockchain,
        signMessage,
      });
    });
  }, [walletBlockchain]);

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
        // @ts-ignore (ignore the non-evm chain types), use switch case to handle all chains for real
        <NotifiContext
          dappAddress={tenantId}
          env={env}
          signMessage={signMessage}
          walletPublicKey={address ?? ''}
          walletBlockchain={walletBlockchain as WalletBlockchain}
        >
          {children}
        </NotifiContext>
      ) : null}
    </div>
  );
};
