import { NotifiContext } from '@notifi-network/notifi-react-card';
import { arrayify } from 'ethers/lib/utils.js';
import { PropsWithChildren } from 'react';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const MetamaskNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { signMessageAsync } = useSignMessage();

  return (
    <div>
      <button onClick={() => connect()} disabled={isConnected}>
        {isConnected ? `${address}` : 'Connect Wallet'}
      </button>
      {isConnected ? (
        <NotifiContext
          dappAddress="junitest.xyz"
          env="Development"
          signMessage={async (message: Uint8Array) => {
            const result = await signMessageAsync({ message });
            return arrayify(result);
          }}
          walletPublicKey={address ?? ''}
          walletBlockchain="AVALANCHE"
        >
          {children}
        </NotifiContext>
      ) : null}
    </div>
  );
};
