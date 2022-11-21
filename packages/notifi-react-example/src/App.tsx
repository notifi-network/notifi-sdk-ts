import { arrayify } from '@ethersproject/bytes';
import {
  SignMessageParams,
  useNotifiClient,
} from '@notifi-network/notifi-react-hooks';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';

import './App.css';

function App() {
  const { publicKey, signMessage, connected } = useWallet();
  const DAPP_ADDRESS = 'junitest.xyz';

  const notifiClient = useNotifiClient({
    dappAddress: DAPP_ADDRESS,
    walletBlockchain: 'SOLANA',
    env: 'Development',
    walletPublicKey: publicKey?.toBase58() ?? '',
  });

  const { logIn, logOut, isAuthenticated } = notifiClient;

  const handleLogin = async () => {
    if (!publicKey) {
      throw new Error('no public key');
    }
    if (!signMessage) {
      throw new Error('no sign message');
    }
    const signer: SignMessageParams = {
      walletBlockchain: 'SOLANA',
      signMessage: async (buffer: Uint8Array) => {
        const result = await signMessage(buffer);
        return arrayify(result);
      },
    };

    await logIn(signer);
  };

  useEffect(() => {
    if (!connected) {
      logOut();
    }
  }, [connected, logOut]);

  const Nav = () => {
    return (
      <nav className="nav">
        {connected ? <WalletDisconnectButton /> : <WalletMultiButton />}
      </nav>
    );
  };

  return (
    <div className="app">
      <Nav />
      <div className="container">
        {connected ? (
          <>
            {!isAuthenticated ? (
              <button
                className="button"
                disabled={isAuthenticated}
                onClick={handleLogin}
              >
                Log In
              </button>
            ) : (
              <>
                <button className="button" onClick={logOut}>
                  Log out
                </button>
                <h2>Message signed!</h2>
              </>
            )}
          </>
        ) : (
          <h1>Connect a wallet to get started</h1>
        )}
      </div>
    </div>
  );
}

export default App;
