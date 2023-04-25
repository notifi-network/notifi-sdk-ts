import {
  FrontendClientData,
  UserState,
  newSolanaClient,
  newSolanaConfig,
} from '@notifi-network/notifi-frontend-client';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC, useMemo, useState } from 'react';

const FrontendClient: FC = () => {
  const { wallet, signMessage, connected } = useWallet();
  const adapter = wallet?.adapter;
  const publicKey = adapter?.publicKey?.toBase58() ?? null;

  const client = useMemo(() => {
    const config = newSolanaConfig(
      publicKey ?? '',
      'junitest.xyz',
      'Development',
    );
    return newSolanaClient(config);
  }, [publicKey]);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [clientData, setClientData] = useState<FrontendClientData>();

  const initClient = async () => {
    const newUserState = await client.initialize();
    setUserState(newUserState);
  };

  const login = async () => {
    if (signMessage) {
      await client.logIn({
        walletBlockchain: 'SOLANA',
        signMessage,
      });
      setUserState(client.userState);
    }
  };

  const logOut = async () => {
    await client.logOut();
    const newUserState = await client.initialize();
    setUserState(newUserState);
  };

  const fetchData = async () => {
    if (userState && userState.status === 'authenticated') {
      const data = await client.fetchData();
      setClientData(data);
    }
  };

  return (
    <>
      {connected ? (
        <div>
          <h1>Frontend Client Example</h1>
          {!!!userState && (
            <button onClick={initClient}>initialize FrontendClient</button>
          )}
          {userState?.status === 'loggedOut' ||
          userState?.status === 'expired' ? (
            <button onClick={login}>login</button>
          ) : null}
          {!!userState && userState.status === 'authenticated' ? (
            <>
              <button onClick={fetchData}>fetch client data</button>
              <button onClick={logOut}>logout</button>
            </>
          ) : null}
          <h2>User State: {userState?.status}</h2>
          {!!clientData && userState?.status === 'authenticated' && (
            <>
              <h2>Client Data: The logged in user has</h2>
              {Object.keys(clientData).map((key, id) => {
                return (
                  <div key={id}>
                    {clientData[key as keyof FrontendClientData].length} {key}
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <WalletMultiButton />
      )}
    </>
  );
};

export default FrontendClient;
