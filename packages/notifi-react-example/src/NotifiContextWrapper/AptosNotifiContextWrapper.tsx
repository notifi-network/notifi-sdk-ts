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
    console.log(signMessageResponse);
    // Make sure signMessageResponse.signature is a string
    if (typeof signMessageResponse.signature !== 'string')
      throw new Error('Can only sign one message at a time');
    return signMessageResponse.signature;
  };

  return (
    <div>
      <button
        onClick={() => connect(wallets[0]!.name)}
        disabled={!wallets[0].name}
      >
        {connected ? `${account?.address}` : 'Connect Wallet'}
      </button>
      {JSON.stringify(account?.publicKey)}
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
