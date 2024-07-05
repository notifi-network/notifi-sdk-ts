'use client';

import {
  InputObject,
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { Connection, clusterApiUrl } from '@solana/web3.js';
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
  /** ⬇️ SOLANA specific */
  let solanaHardwareLoginPlugin: MemoProgramHardwareLoginPlugin | null = null;
  const connection = new Connection(
    process.env.NEXT_PUBLIC_SOLANA_RPC_HTTP ?? clusterApiUrl('mainnet-beta'),
    {
      wsEndpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_WS,
    },
  );
  /** ⬆️ SOLANA specific */
  if (selectedWallet) {
    switch (selectedWallet) {
      // NOTE: ⬇️ Wallet specific signMessage implementation
      case 'keplr':
        accountAddress = wallets[selectedWallet].walletKeys?.bech32 ?? '';
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
        accountAddress = wallets[selectedWallet].walletKeys?.bech32 ?? '';
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
      case 'phantom':
        if (!wallets[selectedWallet].walletKeys)
          throw new Error('ERROR: invalid walletKeys');
        walletPublicKey = wallets[selectedWallet].walletKeys!.base58;
        signMessage = wallets[selectedWallet].signArbitrary;
        solanaHardwareLoginPlugin = new MemoProgramHardwareLoginPlugin({
          walletPublicKey,
          connection,
          sendTransaction: wallets[selectedWallet].signTransaction,
        });
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
            walletAddress: [{ label: '', value: walletPublicKey }],
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
            walletAddress: [{ label: '', value: accountAddress }],
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
          toggleTargetAvailability={{ wallet: true }} // **IMPORTANT** Enable wallet only for Coinbase Wallet. Wallet target only supports Coinbase Wallet for now
          walletBlockchain={'ETHEREUM'} // Change to any EVM chain if needed
          walletPublicKey={walletPublicKey}
          signMessage={signMessage}
          cardId={cardId}
          inputs={{
            pricePairs: pricePairInputs,
            walletAddress: [{ label: '', value: walletPublicKey }],
          }}
          notificationCountPerPage={8}
        >
          {children}
        </NotifiContextProvider>
      ) : null}
      {selectedWallet === 'phantom' && solanaHardwareLoginPlugin ? (
        <NotifiContextProvider
          tenantId={tenantId}
          env={env}
          walletBlockchain={'SOLANA'}
          walletPublicKey={walletPublicKey}
          signMessage={signMessage}
          cardId={cardId}
          inputs={{
            pricePairs: pricePairInputs,
          }}
          notificationCountPerPage={8}
          hardwareLoginPlugin={solanaHardwareLoginPlugin}
        >
          {children}
        </NotifiContextProvider>
      ) : null}
    </>
  );
};
