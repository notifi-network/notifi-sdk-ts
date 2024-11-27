import {
  InputObject,
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useQuery } from '@tanstack/react-query';
import { getBytes } from 'ethers';
import React, { PropsWithChildren } from 'react';

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
const env = process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment;
const walletBlockchain = process.env.NEXT_PUBLIC_CHAIN! as any;
const cardId = process.env.NEXT_PUBLIC_NOTIFI_SUBSCRIPTION_CARD_ID!;

const getPricePair = (
  pricePair: [],
  chain: string,
  pricePairInputs: InputObject[],
  pricePairsWithTermInputs: InputObject[],
  chainLabel: string,
) => {
  pricePair.forEach((pair) => {
    const { tokenSymbol } = pair;

    const exchange = chain;
    const exchange_label = chainLabel;
    const label = `${tokenSymbol} / USD - ${exchange_label}`;
    const labelWithLongTerm = `LONG ${tokenSymbol} / USD - ${exchange_label}`;
    const labelWithShortTerm = `SHORT ${tokenSymbol} / USD - ${exchange_label}`;
    const value = `${tokenSymbol}_USD_${exchange}`;
    const valueWithLongTerm = `LONG_${tokenSymbol}_USD_${exchange}`;
    const valueWithShortTerm = `SHORT_${tokenSymbol}_USD_${exchange}`;
    const pricePairInput = { label, value };
    const pricePairWithLongTermInput = {
      label: labelWithLongTerm,
      value: valueWithLongTerm,
    };
    const pricePairWithShortTermInput = {
      label: labelWithShortTerm,
      value: valueWithShortTerm,
    };

    pricePairInputs.push(pricePairInput);
    pricePairsWithTermInputs.push(pricePairWithLongTermInput);
    pricePairsWithTermInputs.push(pricePairWithShortTermInput);
  });
};

const sortList = (
  pricePairInputs: InputObject[],
  pricePairsWithTermInputs: InputObject[],
) => {
  pricePairInputs.sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  });
  pricePairsWithTermInputs.sort((a, b) => {
    const secondTermA = a.label.split(' ')[1];
    const secondTermB = b.label.split(' ')[1];
    return secondTermA.localeCompare(secondTermB);
  });
};

export const NotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { wallets, selectedWallet } = useWallets();

  const { isLoading: isArbLoading, data: arbData } = useQuery({
    queryKey: ['arb'],
    queryFn: async () => {
      const response = await fetch(
        'https://arbitrum-api.gmxinfra.io/prices/tickers',
      );
      return response.json();
    },
  });

  const { isLoading: isAvaxLoading, data: avaxData } = useQuery({
    queryKey: ['avax'],
    queryFn: async () => {
      const response = await fetch(
        'https://avalanche-api.gmxinfra.io/prices/tickers',
      );
      return response.json();
    },
  });

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
          return Uint8Array.from(Buffer.from(result.signature, 'base64'));
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
        walletPublicKey =
          wallets[selectedWallet].walletKeys?.hex?.toLowerCase() ?? '';
        if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
        signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
          const messageString = Buffer.from(message).toString('utf8');
          const result =
            await wallets[selectedWallet].signArbitrary(messageString);
          if (!result) throw new Error('ERROR: invalid signature');
          return getBytes(result);
        };
        break;
    }
  }

  if (!signMessage) return null;

  const pricePairInputs: InputObject[] = [];
  const pricePairsWithTermInputs: InputObject[] = [];

  if (avaxData && !isAvaxLoading) {
    getPricePair(
      avaxData,
      'AVALANCHE',
      pricePairInputs,
      pricePairsWithTermInputs,
      'Avax',
    );
    sortList(pricePairInputs, pricePairsWithTermInputs);
  }

  if (arbData && !isArbLoading) {
    getPricePair(
      arbData,
      'ARBITRUM',
      pricePairInputs,
      pricePairsWithTermInputs,
      'Arb',
    );
    sortList(pricePairInputs, pricePairsWithTermInputs);
  }

  return (
    <NotifiContextProvider
      tenantId={tenantId}
      env={env}
      walletBlockchain={walletBlockchain}
      walletPublicKey={walletPublicKey}
      inputs={{
        pricePairs: pricePairInputs,
        pricePairsWithTerm: pricePairsWithTermInputs,
        walletAddress: [{ label: '', value: walletPublicKey }],
      }}
      signMessage={signMessage}
      cardId={cardId}
    >
      {children}
    </NotifiContextProvider>
  );
};
