'use client';

import { DummyAlertsModal } from '@/components/DummyAlertsModal';
import { EcosystemHero } from '@/components/EcosystemHero';
import { PoweredByNotifi } from '@/components/PoweredByNotifi';
// import { useWallets } from '@/context/wallet/NotifiWalletProvider';
import { useRouterAsync } from '@/hooks/useRouterAsync';
import { useChain, useWalletClient } from '@cosmos-kit/react';
import '@interchain-ui/react/styles';
import {
  ConfigFactoryInput,
  newFrontendClient,
} from '@notifi-network/notifi-frontend-client';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { getBytes } from 'ethers';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { connect, isWalletConnecting } = useChain('injective');
  const { isLoadingRouter, handleRoute } = useRouterAsync();
  const { client } = useWalletClient();
  const { selectWallet, selectedWallet, wallets } = useWallets();

  useEffect(() => {
    if (client) {
      client?.getAccount?.('injective-1').then((account) => {
        if (account) {
          handleRoute('/notifi');
        }
      });
    }
  }, [client]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center inter.className">
      <div>{selectedWallet && JSON.stringify(wallets[selectedWallet])}</div>
      <div
        onClick={() =>
          selectWallet(selectedWallet === 'keplr' ? 'metamask' : 'keplr')
        }
      >
        selected wallet: {selectedWallet}, switch
      </div>
      <div
        onClick={() => {
          if (!selectedWallet) return;
          wallets[selectedWallet].connect();
        }}
      >
        connect
      </div>
      <div
        onClick={() => {
          if (!selectedWallet) return;
          const config: ConfigFactoryInput = {
            account: {
              address: wallets[selectedWallet].walletKeys?.bech32 ?? '',
              publicKey:
                selectedWallet === 'metamask'
                  ? wallets[selectedWallet].walletKeys?.hex ?? ''
                  : wallets[selectedWallet].walletKeys?.base64 ?? '',
            },
            tenantId: '11xwv3eucnwz5rfvfnqq',
            walletBlockchain: 'INJECTIVE',
            env: 'Development',
          };
          const frontendClient = newFrontendClient(config);
          frontendClient.logIn({
            walletBlockchain: 'INJECTIVE',
            signMessage: async (message) => {
              if (selectedWallet === 'keplr') {
                // const walletPublicKey =
                //   wallets[selectedWallet].walletKeys!.base64;
                const result = await wallets[selectedWallet].signArbitrary(
                  message,
                );
                console.log('result', result);
                return Buffer.from(result.signature, 'base64');
              }
              if (selectedWallet === 'metamask') {
                // const walletPublicKey = wallets[selectedWallet].walletKeys!.hex;
                // Convert uint8array to utf8 string
                const messageString = Buffer.from(message).toString('utf8');
                // Hex message
                const messageHex = hexer(messageString);
                console.log('messageString', messageString);
                const result = await wallets[selectedWallet].signArbitrary(
                  messageHex,
                );
                console.log('result', result);
                return getBytes(result);
              }
              throw new Error('Unsupported wallet');
            },
          });
        }}
      >
        sign Notifi
      </div>

      <div className="fixed top-8 left-8 right-8 flex justify-between">
        <div className="left-8 flex items-center">
          <Image
            src="/logos/injective.png"
            width={115}
            height={24}
            alt="Injective"
          />
          <div className="mx-4 h-4 border-l-2 border-grey-700"></div>
          <div className="text-gray-400 text-xs tracking-wider">
            INJECTIVE ECOSYSTEM ALERTS
          </div>
        </div>
        <div className=" p-2 bg-white rounded-lg h-7">
          <PoweredByNotifi />
        </div>
      </div>
      <EcosystemHero
        isLoading={isWalletConnecting || isLoadingRouter}
        cta={connect}
        ctaButtonText="Connect Wallet To Start"
      />
      <DummyAlertsModal />
    </main>
  );
}

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
