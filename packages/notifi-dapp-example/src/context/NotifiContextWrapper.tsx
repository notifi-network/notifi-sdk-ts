import {
  InputObject,
  NotifiEnvironment,
} from '@notifi-network/notifi-frontend-client';
import { NotifiContextProvider } from '@notifi-network/notifi-react';
import { useWallets } from '@notifi-network/notifi-wallet-provider';
import { useQuery } from '@tanstack/react-query';
import { getBytes } from 'ethers';
import { useRouter } from 'next/navigation';
import React, { PropsWithChildren, useEffect, useState } from 'react';

import { validateCardIdExists } from '../utils/cardIdValidation';

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID!;
const env = process.env.NEXT_PUBLIC_ENV! as NotifiEnvironment;
const walletBlockchain = process.env.NEXT_PUBLIC_CHAIN! as any;
const defaultCardId = process.env.NEXT_PUBLIC_NOTIFI_SUBSCRIPTION_CARD_ID!;

type NotifiContextWrapperProps = {
  cardId?: string;
};

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

export const NotifiContextWrapper: React.FC<
  PropsWithChildren<NotifiContextWrapperProps>
> = ({ children, cardId }) => {
  const { wallets, selectedWallet } = useWallets();
  const router = useRouter();
  const [currentCardId, setCurrentCardId] = useState(cardId ?? defaultCardId);
  const [isValidatingCardId, setIsValidatingCardId] = useState(false);
  const hasValidated = React.useRef(false);
  const isUsingCustomCardId = cardId !== undefined && cardId !== defaultCardId;

  useEffect(() => {
    if (!isUsingCustomCardId || hasValidated.current) return;

    const removeCardIdFromUrl = () => {
      if (typeof window !== 'undefined') {
        const newSearchParams = new URLSearchParams(window.location.search);
        newSearchParams.delete('cardid');
        const newSearch = newSearchParams.toString();
        const newPath =
          window.location.pathname + (newSearch ? `?${newSearch}` : '');
        router.replace(newPath);
      }
    };

    const validateCardId = async () => {
      setIsValidatingCardId(true);
      try {
        const isValid = await validateCardIdExists(cardId!, tenantId, env);

        if (!isValid) {
          console.warn(
            `CardId "${cardId}" not found in backend. Falling back to default cardId "${defaultCardId}"`,
          );
          setCurrentCardId(defaultCardId);
          removeCardIdFromUrl();
        }
      } catch (error) {
        console.warn(
          `Failed to validate cardId "${cardId}". Falling back to default cardId "${defaultCardId}"`,
          error,
        );
        setCurrentCardId(defaultCardId);
        removeCardIdFromUrl();
      } finally {
        setIsValidatingCardId(false);
        hasValidated.current = true;
      }
    };

    validateCardId();
  }, [cardId, isUsingCustomCardId]);

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
      key={`${walletPublicKey}-${currentCardId}`}
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
      cardId={currentCardId}
    >
      {children}
    </NotifiContextProvider>
  );
};
