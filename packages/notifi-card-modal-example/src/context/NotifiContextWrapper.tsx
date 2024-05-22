'use client';

import {
  InputObject,
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { getBytes } from 'ethers';
import { PropsWithChildren } from 'react';

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
const env = process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment;
const cardId = process.env.NEXT_PUBLIC_CARD_ID!;

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
  let accountAddress = '';
  let walletPublicKey = '';
  let signMessage;
  if (selectedWallet) {
    accountAddress = wallets[selectedWallet].walletKeys?.bech32 ?? '';
    switch (selectedWallet) {
      // TODO: Other wallets
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
        walletPublicKey = wallets[selectedWallet].walletKeys?.hex ?? '';
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

  if (!signMessage) return <div>No available wallet to sign</div>;
  const pricePairInputs: InputObject[] = [
    { label: 'BTC-LINK (LINK)', value: 'BTC_LINK' },
    { label: 'BTC-ETH (ETH)', value: 'BTC_ETH' },
  ];

  return (
    <>
      {selectedWallet === 'metamask' ? (
        <NotifiContextProvider
          tenantId={tenantId}
          env={env}
          walletBlockchain={'ETHEREUM'} // Change to any EVM chain if needed
          walletPublicKey={walletPublicKey}
          signMessage={signMessage}
          cardId={cardId}
          inputs={{
            pricePairs: pricePairInputs,
          }}
          notificationCountPerPage={8}
        >
          {children}
        </NotifiContextProvider>
      ) : null}
      {selectedWallet === 'keplr' ? (
        <NotifiContextProvider
          tenantId={tenantId}
          env={env}
          walletBlockchain={'INJECTIVE'} // Switching between Cosmos chains are not supported yet
          walletPublicKey={walletPublicKey}
          accountAddress={accountAddress}
          signMessage={signMessage}
          cardId={cardId}
          inputs={{
            pricePairs: pricePairInputs,
          }}
          notificationCountPerPage={8}
        >
          {children}
        </NotifiContextProvider>
      ) : null}
    </>
  );
};
