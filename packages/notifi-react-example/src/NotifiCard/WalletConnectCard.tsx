import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import { arrayify } from 'ethers/lib/utils.js';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { connector } from '../walletProviders/WalletConnectProvider';

export const WalletConnectCard = () => {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: connector,
  });
  const { disconnect } = useDisconnect();

  const { signMessageAsync } = useSignMessage();
  return (
    <div>
      <h1>Notifi Card: WalletConnect</h1>
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
          <div style={{ width: '400px' }}>
            <NotifiSubscriptionCard
              cardId="7fa9505a96064ed6b91ba2d14a9732de"
              darkMode //optional
            />
          </div>
        </NotifiContext>
      ) : null}
    </div>
  );
};
