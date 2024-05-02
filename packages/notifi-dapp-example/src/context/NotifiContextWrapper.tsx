import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { getBytes } from 'ethers';
import React, { PropsWithChildren } from 'react';

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
const env = process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment;
const walletBlockchain = process.env.NEXT_PUBLIC_CHAIN! as any; // ref:  NotifiParams['walletBlockchain']
const cardId = process.env.NEXT_PUBLIC_NOTIFI_SUBSCRIPTION_CARD_ID!;

export const NotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { wallets, selectedWallet } = useWallets();

  if (
    !selectedWallet ||
    !wallets[selectedWallet].walletKeys ||
    !wallets[selectedWallet].signArbitrary
  )
    return null;
  let walletPublicKey = '';
  let signMessage;
  if (selectedWallet) {
    switch (selectedWallet) {
      case 'keplr':
        walletPublicKey = wallets[selectedWallet].walletKeys?.base64 ?? '';
        if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
        signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
          const result = await wallets[selectedWallet].signArbitrary(message);

          if (!result) throw new Error('ERROR: invalid signature');
          return Buffer.from(result.signature, 'base64');
        };
        break;
      case 'metamask':
      case 'walletconnect':
      case 'okx':
      case 'rabby':
      case 'binance':
      case 'rainbow':
      case 'zerion':
      case 'coinbase':
        walletPublicKey = wallets[selectedWallet].walletKeys?.hex ?? '';
        console.log('walletPublicKey', walletPublicKey);
        if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
        signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
          const messageString = Buffer.from(message).toString('utf8');
          const result = await wallets[selectedWallet].signArbitrary(
            messageString,
          );
          if (!result) throw new Error('ERROR: invalid signature');
          return getBytes(result);
        };
        break;
    }
  }

  return (
    <NotifiContextProvider
      tenantId={tenantId}
      env={env}
      walletBlockchain={walletBlockchain}
      walletPublicKey={walletPublicKey}
      // accountAddress={accountAddress}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      //the type error can be fixed when we remove injecive wallet and use only notifi wallet
      signMessage={signMessage}
      cardId={cardId}
    >
      {children}
    </NotifiContextProvider>
  );
};
