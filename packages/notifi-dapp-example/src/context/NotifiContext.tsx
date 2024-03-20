'use client';

import { NotifiEnvironment } from '@notifi-network/notifi-frontend-client';
import { NotifiContext } from '@notifi-network/notifi-react-card';
import '@notifi-network/notifi-react-card/dist/index.css';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { getBytes } from 'ethers';
import React, { PropsWithChildren } from 'react';

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
const env = process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment;
const walletBlockchain = process.env.NEXT_PUBLIC_CHAIN! as any; // ref:  NotifiParams['walletBlockchain']

export const NotifiContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { wallets, selectedWallet } = useWallets();

  if (
    !selectedWallet ||
    !wallets[selectedWallet].walletKeys ||
    !wallets[selectedWallet].signArbitrary
  )
    return null;

  const accountAddress = wallets[selectedWallet].walletKeys?.bech32;
  let walletPublicKey: string | undefined = undefined;
  let signMessage;
  switch (selectedWallet) {
    case 'keplr':
      walletPublicKey = wallets[selectedWallet].walletKeys?.base64;
      if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
      signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
        const result = await wallets[selectedWallet].signArbitrary(message);

        if (!result) throw new Error('ERROR: invalid signature');
        return Buffer.from(result.signature, 'base64');
      };
      break;
    case 'metamask':
      walletPublicKey = wallets[selectedWallet].walletKeys?.hex;
      if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
      signMessage = async (message: Uint8Array) => {
        const messageString = Buffer.from(message).toString('utf8');
        const result = await wallets[selectedWallet].signArbitrary(
          messageString,
        );
        if (!result) throw new Error('ERROR: invalid signature');
        return getBytes(result);
      };
      break;
  }

  return (
    <NotifiContext
      dappAddress={tenantId}
      walletBlockchain={walletBlockchain}
      env={env}
      walletPublicKey={walletPublicKey}
      accountAddress={accountAddress}
      signMessage={signMessage}
    >
      {children}
    </NotifiContext>
  );
};
