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

const sortList = (pricePairInputs: InputObject[]) => {
  pricePairInputs.sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  });
};

export const NotifiContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { wallets, selectedWallet } = useWallets();

  const { isLoading: isArbLoading, data: arbData } = useQuery(
    ['arb'],
    async () => {
      const response = await fetch(
        'https://arbitrum-api.gmxinfra.io/prices/tickers',
      );
      return response.json();
    },
  );

  const { isLoading: isAvaxLoading, data: avaxData } = useQuery(
    ['avax'],
    async () => {
      const response = await fetch(
        'https://avalanche-api.gmxinfra.io/prices/tickers',
      );
      return response.json();
    },
  );

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
        walletPublicKey =
          wallets[selectedWallet].walletKeys?.hex?.toLowerCase() ?? '';
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
      case 'xion':
        walletPublicKey = wallets[selectedWallet].walletKeys?.pubKey ?? '';
        if (!walletPublicKey) throw new Error('ERROR: invalid walletPublicKey');
        signMessage = async (message: Uint8Array): Promise<Uint8Array> => {
          const messageString = Buffer.from(message).toString('utf8');
          const result = await wallets[selectedWallet].signArbitrary(
            messageString,
          );
          if (!result) throw new Error('ERROR: invalid signature');

          return Buffer.from(result, 'base64');
        };
        break;
    }
  }

  if (!signMessage) return <div>No available wallet to sign</div>;

  const pricePairInputs: InputObject[] = [];

  if (avaxData && !isAvaxLoading) {
    getPricePair(avaxData, 'AVALANCHE', pricePairInputs, 'Avax');
    sortList(pricePairInputs);
  }

  if (arbData && !isArbLoading) {
    getPricePair(arbData, 'ARBITRUM', pricePairInputs, 'Arb');
    sortList(pricePairInputs);
  }

  if (selectedWallet === 'xion') {
    const walletKeys = wallets[selectedWallet].walletKeys;
    const signingAddress = walletKeys?.grantee ?? '';
    const signingPubkey = walletKeys?.granter ?? '';

    return (
      <NotifiContextProvider
        tenantId={tenantId}
        env={env}
        walletBlockchain={walletBlockchain}
        walletPublicKey={walletPublicKey}
        signingAddress={signingAddress}
        signingPubkey={signingPubkey}
        signMessage={signMessage}
        cardId={cardId}
      >
        {children}
      </NotifiContextProvider>
    );
  }

  return (
    <NotifiContextProvider
      tenantId={tenantId}
      env={env}
      walletBlockchain={walletBlockchain}
      walletPublicKey={walletPublicKey}
      inputs={{
        pricePairs: pricePairInputs,
        walletAddress: [{ label: '', value: walletPublicKey }],
      }}
      signMessage={signMessage}
      cardId={cardId}
    >
      {children}
    </NotifiContextProvider>
  );
};
