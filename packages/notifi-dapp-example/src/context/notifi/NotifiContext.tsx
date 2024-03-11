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
        // Convert uint8array to utf8 string
        const messageString = Buffer.from(message).toString('utf8');
        // Hex message
        const messageHex = hexer(messageString);
        console.log('messageString', messageString);
        const result = await wallets[selectedWallet].signArbitrary(messageHex);
        if (!result) throw new Error('ERROR: invalid signature');
        return getBytes(result);
      };
      break;
  }
  console.log({ walletPublicKey, accountAddress });

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

// TODO: Migrate to utils
// https://docs.metamask.io/wallet/reference/personal_sign/?Challenge=0xEbDc3E251ACf56DfDE7DF4DD546ff047C58E26D8&Address=0xEbDc3E251ACf56DfDE7DF4DD546ff047C58E26D8
//https://github.com/danfinlay/browser-string-hexer/blob/main/index.js
function hexer(input: string) {
  const utf8 = toUTF8Array(input);
  const hex = utf8.map((n) => n.toString(16));
  return '0x' + hex.join('');
}

// From https://stackoverflow.com/a/18729931
function toUTF8Array(str: string) {
  const utf8: any[] = [];
  for (let i = 0; i < str.length; i++) {
    let charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
  }
  return utf8;
}
