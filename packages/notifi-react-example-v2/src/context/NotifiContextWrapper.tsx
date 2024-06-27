'use client';

import {
  InputObject,
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { getBytes } from 'ethers';
import { useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

export const NotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const searchParams = useSearchParams();
  const tenantId =
    searchParams.get('tenantid') ?? process.env.NEXT_PUBLIC_TENANT_ID ?? null;
  const env =
    (searchParams.get('env') as NotifiEnvironment) ??
    (process.env.NEXT_PUBLIC_ENV as NotifiEnvironment) ??
    null;
  const cardId =
    searchParams.get('cardid') ?? process.env.NEXT_PUBLIC_CARD_ID ?? null;

  if (!tenantId || !env || !cardId)
    throw new Error('ERROR: cannot find tenantId, env, or cardId');

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
      case 'coinbase':
        walletPublicKey = wallets[selectedWallet].walletKeys?.hex ?? '';
        if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
        signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
          const messageString = Buffer.from(message).toString('utf8');
          console.log('sign params:', {
            wallets,
            selectedWallet,
            messageString,
          });
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
    { label: 'BTC-NOTIFI (NOTIFI)', value: 'BTC_NOTIFI' },
    { label: 'BTC-LINK (LINK)', value: 'BTC_LINK' },
    { label: 'BTC-ETH (ETH)', value: 'BTC_ETH' },
    { label: 'BTC-USDC (USDC)', value: 'BTC_USDC' },
    { label: 'BTC-USDT (USDT)', value: 'BTC_USDT' },
    { label: 'BTC-BUSD (BUSD)', value: 'BTC_BUSD' },
    { label: 'BTC-SOL (SOL)', value: 'BTC_SOL' },
  ];

  return (
    <>
      <ul>
        <li>
          Select{' '}
          <span style={{ fontWeight: 800 }}>Notifi Component Example</span> if
          you want to try the react component: NotifiCardModal
        </li>
        <li>
          Select <span style={{ fontWeight: 800 }}>Notifi Context Example</span>{' '}
          if you want to try the react context (advanced)
        </li>
      </ul>

      {selectedWallet === 'metamask' ? (
        <NotifiContextProvider
          tenantId={tenantId}
          env={env}
          // toggleTargetAvailability={{ discord: false }}
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
      {selectedWallet === 'coinbase' ? (
        <NotifiContextProvider
          tenantId={tenantId}
          env={env}
          toggleTargetAvailability={{ wallet: true }}
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
    </>
  );
};
