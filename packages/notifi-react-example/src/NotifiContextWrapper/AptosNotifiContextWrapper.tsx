import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AptosSignMessageFunction } from '@notifi-network/notifi-frontend-client';
import { NotifiContext } from '@notifi-network/notifi-react-card';
import { PropsWithChildren } from 'react';

export const AptosNotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const {
    connect,
    account,
    connected,
    wallets,
    disconnect,
    signMessage: aptosSignMessage,
  } = useWallet();

  const signMessage: AptosSignMessageFunction = async (
    message: string,
    timestamp: number,
  ) => {
    console.log(JSON.stringify({ message, timestamp }));
    const signMessageResponse = await aptosSignMessage({
      address: false,
      application: false,
      chainId: true,
      message,
      nonce: timestamp.toString(),
    });
    if (!signMessageResponse) throw new Error('Sign message failed');

    /** DEBUG LOG */
    console.log(signMessageResponse);

    // Make sure signMessageResponse.signature is a string
    if (typeof signMessageResponse.signature !== 'string')
      throw new Error(
        `this wallet's signMessage does not follow the official interface of SignMessageResponse`,
      );
    return signMessageResponse.signature;
  };

  return (
    <div>
      {!connected ? (
        <>
          <button
            onClick={() => connect(wallets[0]!.name)}
            disabled={!wallets[0].name}
          >
            {`Connect Wallet ${wallets[0]!.name}`}
          </button>
          <button
            onClick={() => connect(wallets[1]!.name)}
            disabled={!wallets[1].name}
          >
            {`Connect Wallet ${wallets[1]?.name}`}
          </button>
        </>
      ) : (
        <button onClick={disconnect}>disconnect {account?.address}</button>
      )}

      {connected ? (
        <NotifiContext
          dappAddress="junitest.xyz"
          env="Development"
          signMessage={signMessage}
          walletPublicKey={
            typeof account!.publicKey === 'string'
              ? account!.publicKey
              : account!.publicKey[0]
          }
          accountAddress={account!.address ?? ''}
          walletBlockchain="APTOS"
        >
          {children}
        </NotifiContext>
      ) : null}
    </div>
  );
};
