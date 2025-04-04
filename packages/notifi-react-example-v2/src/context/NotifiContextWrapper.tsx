'use client';

import {
  InputObject,
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';
import {
  NotifiContextProvider,
  NotifiSmartLinkContextProvider,
} from '@notifi-network/notifi-react';
import { NotifiContextProviderWithWalletTargetPlugin } from '@notifi-network/notifi-react-wallet-target-plugin';
import { MemoProgramHardwareLoginPlugin } from '@notifi-network/notifi-solana-hw-login';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import {
  Connection,
  Transaction,
  VersionedTransaction,
  clusterApiUrl,
} from '@solana/web3.js';
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
          const result =
            await wallets[selectedWallet].signArbitrary(messageString);
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
          signTransaction: async <T extends Transaction | VersionedTransaction>(
            transaction: T,
          ): Promise<T> => {
            if (transaction instanceof Transaction) {
              const signedTransaction =
                await wallets[selectedWallet].signHardwareTransaction(
                  transaction,
                );
              return signedTransaction as T;
            } else {
              throw new Error('VersionedTransaction not supported');
            }
          },
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
        <NotifiSmartLinkContextProvider
          env={env}
          authParams={{
            walletPublicKey,
            walletBlockchain: 'ARBITRUM', // Change to any EVM chain if needed
          }}
        >
          <NotifiContextProvider
            tenantId={tenantId}
            env={env}
            // toggleTargetAvailability={{ discord: false }}
            walletBlockchain={'ARBITRUM'} // Change to any EVM chain if needed
            walletPublicKey={walletPublicKey}
            signMessage={signMessage}
            cardId={cardId}
            inputs={{
              pricePairs: pricePairInputs,
              walletAddress: [{ label: '', value: walletPublicKey }],
            }}
            notificationCountPerPage={8}
            isEnabledLoginViaTransaction // TODO: Enable when ready
          >
            {children}
          </NotifiContextProvider>
        </NotifiSmartLinkContextProvider>
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
        <NotifiContextProviderWithWalletTargetPlugin
          tenantId={tenantId}
          env={env}
          /**IMPORTANT** Wallet Target is disabled by default (toggleTargetAvailability={{ wallet: false }}). Please Check the followings before enabling it.
           * - Wallet Target only supports Coinbase for now. You might want to switch the availability according the connected wallet.
           * - Wrap the component with `NotifiContextProviderWithWalletTargetPlugin` provider instead of `NotifiContextProvider`  When enabling the wallet target (toggleTargetAvailability={{ wallet: true }}).
           */
          toggleTargetAvailability={{ wallet: true }}
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
        </NotifiContextProviderWithWalletTargetPlugin>
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
          isEnabledLoginViaTransaction
        >
          {children}
        </NotifiContextProvider>
      ) : null}
    </>
  );
};
