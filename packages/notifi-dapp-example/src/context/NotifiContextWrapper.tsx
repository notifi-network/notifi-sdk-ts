import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import { NotifiContext } from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { getBytes } from 'ethers';
import React, { PropsWithChildren } from 'react';

import { useInjectiveWallets } from './InjectiveWalletContext';
import { NotifiTargetContextProvider } from './NotifiTargetContext';
import { NotifiTenantConfigContextProvider } from './NotifiTenantConfigContext';
import { NotifiTopicContextProvider } from './NotifiTopicContext';
import { NotifiUserSettingContextProvider } from './NotifiUserSettingContext';

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
const env = process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment;
const walletBlockchain = process.env.NEXT_PUBLIC_CHAIN! as any; // ref:  NotifiParams['walletBlockchain']

export const NotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { wallets, selectedWallet } = useWallets();
  const { wallets: injectiveWallets, selectedWallet: injectiveSelectedWallet } =
    useInjectiveWallets();

  if (
    (!selectedWallet ||
      !wallets[selectedWallet].walletKeys ||
      !wallets[selectedWallet].signArbitrary) &&
    (!injectiveSelectedWallet ||
      !injectiveWallets[injectiveSelectedWallet].walletKeys ||
      !injectiveWallets[injectiveSelectedWallet].signArbitrary)
  )
    return null;
  let accountAddress = '';
  let walletPublicKey = '';
  let signMessage;
  if (selectedWallet) {
    accountAddress = wallets[selectedWallet].walletKeys?.bech32 ?? '';
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
  if (injectiveSelectedWallet) {
    accountAddress =
      injectiveWallets[injectiveSelectedWallet].walletKeys?.bech32 ?? '';
    switch (injectiveSelectedWallet) {
      case 'leap':
        walletPublicKey =
          injectiveWallets[injectiveSelectedWallet].walletKeys?.base64 ?? '';
        if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
        signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
          const str = new TextDecoder().decode(message);
          const result = await injectiveWallets[
            injectiveSelectedWallet
          ].signArbitrary(str);
          if (!result) throw new Error('ERROR: invalid signature');
          return Buffer.from(result, 'base64');
        };
        break;
      case 'phantom':
        walletPublicKey =
          injectiveWallets[injectiveSelectedWallet].walletKeys?.hex ?? '';
        if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
        signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
          const str = new TextDecoder().decode(message);
          const result = await injectiveWallets[
            injectiveSelectedWallet
          ].signArbitrary(str);

          if (!result) throw new Error('ERROR: invalid signature');
          return Buffer.from(result, 'base64');
        };
        break;
    }
  }
  return (
    <NotifiContext
      dappAddress={tenantId}
      walletBlockchain={walletBlockchain}
      env={env}
      walletPublicKey={walletPublicKey}
      accountAddress={accountAddress}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      //the type error can be fixed when we remove injecive wallet and use only notifi wallet
      signMessage={signMessage}
    >
      <NotifiTenantConfigContextProvider>
        <NotifiTargetContextProvider>
          <NotifiTopicContextProvider>
            <NotifiUserSettingContextProvider>
              {children}
            </NotifiUserSettingContextProvider>
          </NotifiTopicContextProvider>
        </NotifiTargetContextProvider>
      </NotifiTenantConfigContextProvider>
    </NotifiContext>
  );
};
