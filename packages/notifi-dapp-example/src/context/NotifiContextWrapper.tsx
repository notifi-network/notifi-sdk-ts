import {
  InputObject,
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';
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

  const pricePairInputs: InputObject[] = [];

  const fetchAvaxData = async () => {
    try {
      const response_avax = await fetch(
        'https://avalanche-api.gmxinfra.io/prices/tickers',
      );
      if (!response_avax.ok) {
        throw new Error('Network response was not ok');
      }
      const avax_data = await response_avax.json();
      getPricePair(avax_data, 'AVALANCHE', pricePairInputs, 'Avax');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchArbData = async () => {
    try {
      const response_arb = await fetch(
        'https://arbitrum-api.gmxinfra.io/prices/tickers',
      );
      if (!response_arb.ok) {
        throw new Error('Network response was not ok');
      }
      const arb_data = await response_arb.json();
      getPricePair(arb_data, 'ARBITRUM', pricePairInputs, 'Arb');
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchAvaxData();
  fetchArbData();

  pricePairInputs.sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  });

  return (
    <NotifiContextProvider
      tenantId={tenantId}
      env={env}
      walletBlockchain={walletBlockchain}
      walletPublicKey={walletPublicKey}
      // accountAddress={accountAddress}
      inputs={{
        pricePairs: pricePairInputs,
      }}
      signMessage={signMessage}
      cardId={cardId}
    >
      {children}
    </NotifiContextProvider>
  );
};

const getPricePair = (
  pricePair: [],
  chain: string,
  pricePairInputs: InputObject[],
  chainLabel: string,
) => {
  pricePair.forEach((pair) => {
    const { tokenSymbol } = pair;

    const exchange = chain;
    const exchange_label = chainLabel;
    const label = `${tokenSymbol} / USD - ${exchange_label}`;
    const value = `${tokenSymbol}_USD_${exchange}`;
    const pricePairInput = { label, value };

    pricePairInputs.push(pricePairInput);
  });
};
