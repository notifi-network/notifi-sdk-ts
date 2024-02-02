'use client';

import { useChain, useWalletClient } from '@cosmos-kit/react';
import '@interchain-ui/react/styles';

export default function Home() {
  // const { chainWallet } = useChainWallet('injective', 'extension');
  const { status, client } = useWalletClient();
  const { connect, disconnect, isWalletConnected } = useChain('injective');
  // useEffect(() => {
  //   console.log(status);
  //   if (status === 'Done') {
  //     console.log('Done');
  //     client?.enable?.(['injective-1']);
  //     client
  //       ?.getAccount?.('injective-1')
  //       .then((account) => console.log(account));
  //     console.log(client);
  //   }
  // }, [status]);
  return (
    <main
      // TODO: depends on NotifiContext
      dark-mode="false"
      className="notifi-dapp flex min-h-screen flex-col items-center justify-center p-24 bg-notifi-page-bg"
    >
      {/* {!client ? ( */}
      <div className="text-lg">Injective Keplr wallet connect</div>
      {!isWalletConnected ? (
        <button
          className="bg-green-100 p-5 rounded"
          onClick={() => {
            if (!connect) return console.log('no connect');
            connect();
          }}
        >
          connect
        </button>
      ) : null}
      {/* {client ? ( */}
      {isWalletConnected ? (
        <button
          className="bg-red-100 p-5 rounded"
          onClick={() => {
            if (!disconnect) return console.log('no disconnect');
            disconnect();
          }}
        >
          disconnect
        </button>
      ) : null}
      {status === 'Done' ? (
        <button
          className="bg-blue-100 p-5 rounded mt-3"
          onClick={async () => {
            if (!client?.signArbitrary) return;
            const account = await client.getAccount?.('injective-1');
            console.log({ account });
            const res = await client.signArbitrary(
              'injective-1',
              account?.address || '',
              'Sign arbitrary message',
            );
            console.log({ res });
          }}
        >
          sign
        </button>
      ) : null}
    </main>
  );
}
