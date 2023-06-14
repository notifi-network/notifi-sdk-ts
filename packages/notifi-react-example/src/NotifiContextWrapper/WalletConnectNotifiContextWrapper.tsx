import { NotifiContext } from '@notifi-network/notifi-react-card';
import { arrayify } from 'ethers/lib/utils.js';
import { PropsWithChildren } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { connector } from '../walletProviders/WalletConnectProvider';

export const WalletConnectNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: connector,
  });

  return (
    <div>
      <button onClick={() => (isConnected ? disconnect() : connect())}>
        {isConnected ? `Disconnect: ${address}` : 'Connect Wallet'}
      </button>
      {isConnected ? (
        <NotifiContext
          dappAddress="testimpl"
          env="Production"
          signMessage={async (message: Uint8Array) => {
            const result = await signMessageAsync({ message });
            return arrayify(result);
          }}
          walletPublicKey={address ?? ''}
          walletBlockchain="ETHEREUM"
        >
          {children}
        </NotifiContext>
      ) : null}
    </div>
  );
};
