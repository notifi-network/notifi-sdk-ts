import {
  Roles,
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
  const [userState, setUserState] = useState<UserState>();

  const initClient = async () => {
    const newUserState = await client.initialize();
    setUserState(newUserState);
  };
  const login = async () => {
    if (signMessage) {
      const { authorization, roles } = await client.logIn({
        walletBlockchain: 'SOLANA',
        signMessage,
      });
      setUserState({
        status: 'authenticated',
        authorization: {
          token: authorization?.token ?? '',
          expiry: authorization?.expiry ?? '',
        },
        roles: roles?.filter((r) => r) as Roles,
      });
    }
  };
  const logOut = async () => {
    await client.logOut();
    const newUserState = await client.initialize();
    setUserState(newUserState);
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
            <button onClick={logOut}>logout</button>
          ) : null}
          <h2>User State: {userState?.status}</h2>
        </div>
      ) : (
        <WalletMultiButton />
      )}
    </>
  );
};

export default FrontendClient;
