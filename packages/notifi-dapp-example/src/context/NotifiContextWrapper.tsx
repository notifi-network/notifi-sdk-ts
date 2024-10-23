import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { getBytes } from 'ethers';
import React, { PropsWithChildren } from 'react';

import { useInjectiveWallets } from './InjectiveWalletContext';
import { NotifiFrontendClientProvider } from './NotifiFrontendClientContext';
import { NotifiTargetContextProvider } from './NotifiTargetContext';
import { NotifiTenantConfigContextProvider } from './NotifiTenantConfigContext';
import { NotifiTopicContextProvider } from './NotifiTopicContext';
import { NotifiUserSettingContextProvider } from './NotifiUserSettingContext';

type NotifiContextWrapperProps = {
  walletBlockchain?: string;
  env?: NotifiEnvironment;
  tenantId?: string;
  cardId?: string;
};

export const NotifiContextWrapper: React.FC<
  PropsWithChildren<NotifiContextWrapperProps>
> = ({ children, ...props }) => {
  const tenantId = props.tenantId ?? process.env.NEXT_PUBLIC_TENANT_ID!;
  const env = props.env ?? (process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment);
  const walletBlockchain =
    props.walletBlockchain ?? (process.env.NEXT_PUBLIC_CHAIN! as any);
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
          
          // @ts-ignore
          const signature = await window.ethereum.request(
            {
              method: 'personal_sign',
              params: [
                Buffer.from(messageString).toString('hex'),
                walletPublicKey,
              ],
            },
          );
          console.log({messageString, payloadForWindowEthereumRequest:  {
            method: 'personal_sign',
            params: [
              Buffer.from(messageString).toString('hex'),
              walletPublicKey,
            ],
          }, rawHexSignature: signature, bytesSignatureConvertedFromHex: getBytes(signature), base64SignatureConvertedFromBtyes: Buffer.from(getBytes(signature)).toString('base64')});

          return getBytes(signature);
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
    <NotifiFrontendClientProvider
      tenantId={tenantId}
      env={env}
      walletBlockchain={walletBlockchain}
      accountAddress={accountAddress}
      walletPublicKey={walletPublicKey}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      //the type error can be fixed when we remove injecive wallet and use only notifi wallet
      signMessage={signMessage}
    >
      <NotifiTenantConfigContextProvider cardId={props.cardId}>
        <NotifiTargetContextProvider>
          <NotifiTopicContextProvider>
            <NotifiUserSettingContextProvider>
              {children}
            </NotifiUserSettingContextProvider>
          </NotifiTopicContextProvider>
        </NotifiTargetContextProvider>
      </NotifiTenantConfigContextProvider>
    </NotifiFrontendClientProvider>
  );
};
