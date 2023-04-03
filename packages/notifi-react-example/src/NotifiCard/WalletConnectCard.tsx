import {
  NotifiContext,
  NotifiSubscriptionCard,
} from '@notifi-network/notifi-react-card';
import { arrayify } from 'ethers/lib/utils.js';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';

import { connector } from '../WalletConnectProvider';

export const WalletConnectCard = () => {
  const { address, isConnected } = useAccount();

  const { connect } = useConnect({
    connector: connector,
  });
  const { disconnect } = useDisconnect();

  const { signMessageAsync } = useSignMessage();
  return (
    <>
      <div>
        <h1>WalletConnect Example</h1>
        <button onClick={() => (isConnected ? disconnect() : connect())}>
          {isConnected ? `Disconnect: ${address}` : 'Connect Wallet'}
        </button>
        {isConnected ? (
          <NotifiContext
            dappAddress="testimpl"
            env="Production"
            signMessage={async (message) => {
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
    </>
  );
};
