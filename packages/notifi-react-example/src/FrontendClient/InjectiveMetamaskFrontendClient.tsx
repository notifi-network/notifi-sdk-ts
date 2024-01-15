import {
  NotifiEnvironment,
  Uint8SignMessageFunction,
  UserState,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { Types } from '@notifi-network/notifi-graphql';
import converter from 'bech32-converting';
import { arrayify } from 'ethers/lib/utils.js';
import { FC, useMemo, useState } from 'react';
import { useAccount, useConnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

export const InjectiveMetamaskFrontendClient: FC = () => {
  const tenantId = process.env.REACT_APP_TENANT_ID!;
  const env = process.env.REACT_APP_ENV! as NotifiEnvironment;
  const { address: ethAddress, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const injAddress = useMemo(() => {
    if (ethAddress) {
      return converter('inj').toBech32(ethAddress);
    }
  }, [ethAddress]);

  const signMessage: Uint8SignMessageFunction = async (message: Uint8Array) => {
    const result = await signMessageAsync({ message });
    return arrayify(result);
  };

  const client = useMemo(() => {
    if (injAddress && ethAddress) {
      return newFrontendClient({
        account: {
          address: injAddress,
          publicKey: ethAddress,
        },
        tenantId,
        env,
        walletBlockchain: 'INJECTIVE',
      });
    }
  }, [injAddress, ethAddress]);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [clientData, setClientData] = useState<Types.FetchDataQuery>();

  const initClient = async () => {
    if (!client) {
      throw new Error('Client not initialized');
    }
    const newUserState = await client.initialize();
    newUserState && setUserState(newUserState);
  };

  const login = async () => {
    if (!client) {
      throw new Error('Client not initialized');
    }
    try {
      await client?.logIn({
        walletBlockchain: 'INJECTIVE',
        signMessage,
      });
    } catch (e) {
      console.log(e);
    }
    setUserState(client.userState);
  };

  const logOut = async () => {
    if (!client) {
      throw new Error('Client not initialized');
    }
    await client.logOut();
    const newUserState = await client.initialize();
    setUserState(newUserState);
  };

  const fetchData = async () => {
    if (!userState || userState.status !== 'authenticated' || !client) {
      throw new Error('Client not initialized or not logged in');
    }
    const data = await client.fetchData();
    setClientData(data);
  };

  return (
    <>
      {injAddress && ethAddress ? (
        <div>
          <h4>Injected Address: {injAddress}</h4>
          <h4>Ethereum Address: {ethAddress}</h4>
          <h1>Frontend Client Example: Injective EVM (Metamask)</h1>
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
                    {clientData[key as keyof Types.FetchDataQuery]?.length}{' '}
                    {key}
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <button onClick={() => connect()} disabled={isConnected}>
          'Connect'
        </button>
      )}
    </>
  );
};
