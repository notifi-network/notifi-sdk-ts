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

const pairsData = [
  {
    ticker_id: 'AVAX_USD',
    base_currency: 'AVAX',
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: 34.863026,
    low: 34.11,
    high: 36.4,
    base_volume: 82750.96531031493,
    target_volume: 2917385.2820151527,
    open_interest: 1079362.7019107407,
  },
  {
    ticker_id: 'ETH_USD',
    base_currency: 'ETH',
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: 3015.9966799999997,
    low: 2979.725,
    high: 3059.739,
    base_volume: 153.17689457948532,
    target_volume: 462553.17022229836,
    open_interest: 7551947.008836235,
  },
  {
    ticker_id: 'BTC_USD',
    base_currency: 'BTC',
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: 62683.4608,
    low: 61787.739,
    high: 63241.934,
    base_volume: 0.6269423601041008,
    target_volume: 39193.19913683199,
    open_interest: 15644844.145743929,
  },
  {
    ticker_id: 'WBTC_USD',
    base_currency: 'WBTC',
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: 62683.4608,
    low: 61787.739,
    high: 63241.934,
    base_volume: 0,
    target_volume: 0,
    open_interest: 1676282.696743848,
  },
  {
    ticker_id: 'WAVAX_ETH',
    base_currency: 'WAVAX',
    target_currency: 'ETH',
    product_type: 'Spot',
    last_price: 0.011559371477822714,
    low: 34.11,
    high: 36.4,
    base_volume: 3690.2011101880516,
    target_volume: 43.082644466356534,
    volume_usd: 130098.04013967974,
  },
  {
    ticker_id: 'WAVAX_BTC',
    base_currency: 'WAVAX',
    target_currency: 'BTC',
    product_type: 'Spot',
    last_price: 0.0005561447858435873,
    low: 34.11,
    high: 36.4,
    base_volume: 150.54023026128937,
    target_volume: 0.08489657999604232,
    volume_usd: 5307.295817861756,
  },
  {
    ticker_id: 'WAVAX_WBTC',
    base_currency: 'WAVAX',
    target_currency: 'WBTC',
    product_type: 'Spot',
    last_price: 0.0005561758325890009,
    low: 34.11,
    high: 36.4,
    base_volume: 293.3027891914053,
    target_volume: 0.16540697235836155,
    volume_usd: 10340.389832942992,
  },
  {
    ticker_id: 'WAVAX_USDC',
    base_currency: 'WAVAX',
    target_currency: 'USDC',
    product_type: 'Spot',
    last_price: 34.863026,
    low: 34.11,
    high: 36.4,
    base_volume: 12182.800069480234,
    target_volume: 429504.6164495256,
    volume_usd: 429504.6164495256,
  },
  {
    ticker_id: 'WAVAX_USDC.e',
    base_currency: 'WAVAX',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 34.863026,
    low: 34.11,
    high: 36.4,
    base_volume: 979.6245150952541,
    target_volume: 34536.66227968318,
    volume_usd: 34536.66227968318,
  },
  {
    ticker_id: 'ETH_BTC',
    base_currency: 'ETH',
    target_currency: 'BTC',
    product_type: 'Spot',
    last_price: 0.04811471226234528,
    low: 2979.725,
    high: 3059.739,
    base_volume: 0.06382350684132407,
    target_volume: 0.0030829463332430725,
    volume_usd: 192.72988596096522,
  },
  {
    ticker_id: 'ETH_WBTC',
    base_currency: 'ETH',
    target_currency: 'WBTC',
    product_type: 'Spot',
    last_price: 0.04811202641169387,
    low: 2979.725,
    high: 3059.739,
    base_volume: 0.39186226616892444,
    target_volume: 0.01892861104648044,
    volume_usd: 1183.3190247428186,
  },
  {
    ticker_id: 'ETH_USDC',
    base_currency: 'ETH',
    target_currency: 'USDC',
    product_type: 'Spot',
    last_price: 3016.326614,
    low: 2979.725,
    high: 3059.739,
    base_volume: 24.291044290837515,
    target_volume: 73352.44375845935,
    volume_usd: 73352.44375845935,
  },
  {
    ticker_id: 'ETH_USDC.e',
    base_currency: 'ETH',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 3015.9966799999997,
    low: 2979.725,
    high: 3059.739,
    base_volume: 0,
    target_volume: 0,
    volume_usd: 0,
  },
  {
    ticker_id: 'BTC_WBTC',
    base_currency: 'BTC',
    target_currency: 'WBTC',
    product_type: 'Spot',
    last_price: 0.9999441781832392,
    low: 61787.739,
    high: 63241.934,
    base_volume: 0,
    target_volume: 0,
    volume_usd: 0,
  },
  {
    ticker_id: 'BTC_USDC',
    base_currency: 'BTC',
    target_currency: 'USDC',
    product_type: 'Spot',
    last_price: 62683.4608,
    low: 61787.739,
    high: 63241.934,
    base_volume: 0.1621476418961761,
    target_volume: 10136.633322,
    volume_usd: 10136.633322,
  },
  {
    ticker_id: 'BTC_USDC.e',
    base_currency: 'BTC',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 62683.4608,
    low: 61787.739,
    high: 63241.934,
    base_volume: 0,
    target_volume: 0,
    volume_usd: 0,
  },
  {
    ticker_id: 'WBTC_USDC',
    base_currency: 'WBTC',
    target_currency: 'USDC',
    product_type: 'Spot',
    last_price: 62683.4608,
    low: 61787.739,
    high: 63241.934,
    base_volume: 0.05676359125239798,
    target_volume: 3548.56662629649,
    volume_usd: 3548.56662629649,
  },
  {
    ticker_id: 'WBTC_USDC.e',
    base_currency: 'WBTC',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 62683.4608,
    low: 61787.739,
    high: 63241.934,
    base_volume: 0,
    target_volume: 0,
    volume_usd: 0,
  },
  {
    ticker_id: 'USDC_USDC.e',
    base_currency: 'USDC',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 1,
    low: 1,
    high: 1,
    base_volume: 26715.86858,
    target_volume: 26715.86858,
    volume_usd: 26715.86858,
  },
];

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
  const accountAddress = wallets[selectedWallet]?.walletKeys?.bech32 ?? '';
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

  pairsData.forEach((pair) => {
    const { ticker_id } = pair;

    const [baseCurrency, targetCurrency] = ticker_id.split('_');
    const exchange = 'AVALANCHE';
    const label = `${baseCurrency}-${targetCurrency} ${exchange}`;
    const value = `${baseCurrency}_${targetCurrency}_${exchange}`;
    const pricePairInput = { label, value };

    pricePairInputs.push(pricePairInput);
  });

  console.log('pricePairInputs', pricePairInputs);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         'https://gmx-integration-cg.vercel.app/api/avalanche/pairs',
  //         {
  //           method: 'POST', // Or 'GET' if it's a GET request
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         },
  //       );

  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }

  //       const data = await response.json();
  //       console.log(data); // Do something with the fetched data
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

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
