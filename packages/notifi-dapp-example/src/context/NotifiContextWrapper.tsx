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

const pairsData_arb = [
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

const pairsData_ava = [
  {
    ticker_id: 'AVAX_USD',
    base_currency: 'AVAX',
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: 34.629999999999995,
    low: 33.676,
    high: 34.698,
    base_volume: 73357.6606234145,
    target_volume: 2507878.3437326713,
    open_interest: 897029.2079306268,
  },
  {
    ticker_id: 'ETH_USD',
    base_currency: 'ETH',
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: 3021.845234247,
    low: 2942.771,
    high: 3022.235,
    base_volume: 924.5803398686139,
    target_volume: 2757563.637399161,
    open_interest: 8817328.26497943,
  },
  {
    ticker_id: 'BTC_USD',
    base_currency: 'BTC',
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: 62554.2,
    low: 60738.849,
    high: 62597.172,
    base_volume: 0.012765223969451966,
    target_volume: 787.2059657830156,
    open_interest: 15642834.190299768,
  },
  {
    ticker_id: 'WBTC_USD',
    base_currency: 'WBTC',
    target_currency: 'USD',
    product_type: 'Perpetual',
    last_price: 62553.659999999996,
    low: 60738.849,
    high: 62597.172,
    base_volume: 0.09801392438604528,
    target_volume: 6044.323718184847,
    open_interest: 1682327.020462033,
  },
  {
    ticker_id: 'WAVAX_ETH',
    base_currency: 'WAVAX',
    target_currency: 'ETH',
    product_type: 'Spot',
    last_price: 0.011459885373192941,
    low: 33.676,
    high: 34.698,
    base_volume: 806.0031238052533,
    target_volume: 9.238826848968866,
    volume_usd: 27554.828793530192,
  },
  {
    ticker_id: 'WAVAX_BTC',
    base_currency: 'WAVAX',
    target_currency: 'BTC',
    product_type: 'Spot',
    last_price: 0.0005535936347762309,
    low: 33.676,
    high: 34.698,
    base_volume: 0.703842823195828,
    target_volume: 0.00039019054452220034,
    volume_usd: 24.06227459659577,
  },
  {
    ticker_id: 'WAVAX_WBTC',
    base_currency: 'WAVAX',
    target_currency: 'WBTC',
    product_type: 'Spot',
    last_price: 0.0005535936347762309,
    low: 33.676,
    high: 34.698,
    base_volume: 38.64425680495595,
    target_volume: 0.02142328245518848,
    volume_usd: 1321.131207391029,
  },
  {
    ticker_id: 'WAVAX_USDC',
    base_currency: 'WAVAX',
    target_currency: 'USDC',
    product_type: 'Spot',
    last_price: 34.629999999999995,
    low: 33.676,
    high: 34.698,
    base_volume: 7259.984785339167,
    target_volume: 248197.09985639006,
    volume_usd: 248197.09985639006,
  },
  {
    ticker_id: 'WAVAX_USDC.e',
    base_currency: 'WAVAX',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 34.629999999999995,
    low: 33.676,
    high: 34.698,
    base_volume: 185.06687128349148,
    target_volume: 6326.8811285687225,
    volume_usd: 6326.8811285687225,
  },
  {
    ticker_id: 'ETH_BTC',
    base_currency: 'ETH',
    target_currency: 'BTC',
    product_type: 'Spot',
    last_price: 0.04830708307704383,
    low: 2942.771,
    high: 3022.235,
    base_volume: 0.031127481377293306,
    target_volume: 0.0015054451382085921,
    volume_usd: 92.83780659022142,
  },
  {
    ticker_id: 'ETH_WBTC',
    base_currency: 'ETH',
    target_currency: 'WBTC',
    product_type: 'Spot',
    last_price: 0.048310125804916934,
    low: 2942.771,
    high: 3022.235,
    base_volume: 0,
    target_volume: 0,
    volume_usd: 0,
  },
  {
    ticker_id: 'ETH_USDC',
    base_currency: 'ETH',
    target_currency: 'USDC',
    product_type: 'Spot',
    last_price: 3021.845234247,
    low: 2942.771,
    high: 3022.235,
    base_volume: 13.44731233530066,
    target_volume: 40106.64938197123,
    volume_usd: 40106.64938197123,
  },
  {
    ticker_id: 'ETH_USDC.e',
    base_currency: 'ETH',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 3021.845234247,
    low: 2942.771,
    high: 3022.235,
    base_volume: 13.457827255130507,
    target_volume: 40138.0101619085,
    volume_usd: 40138.0101619085,
  },
  {
    ticker_id: 'BTC_WBTC',
    base_currency: 'BTC',
    target_currency: 'WBTC',
    product_type: 'Spot',
    last_price: 1,
    low: 60738.849,
    high: 62597.172,
    base_volume: 0,
    target_volume: 0,
    volume_usd: 0,
  },
  {
    ticker_id: 'BTC_USDC',
    base_currency: 'BTC',
    target_currency: 'USDC',
    product_type: 'Spot',
    last_price: 62554.91,
    low: 60738.849,
    high: 62597.172,
    base_volume: 0,
    target_volume: 0,
    volume_usd: 0,
  },
  {
    ticker_id: 'BTC_USDC.e',
    base_currency: 'BTC',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 62554.91,
    low: 60738.849,
    high: 62597.172,
    base_volume: 0.03526030279507719,
    target_volume: 2174.432723,
    volume_usd: 2174.432723,
  },
  {
    ticker_id: 'WBTC_USDC',
    base_currency: 'WBTC',
    target_currency: 'USDC',
    product_type: 'Spot',
    last_price: 62554.91,
    low: 60738.849,
    high: 62597.172,
    base_volume: 0.7055134107869353,
    target_volume: 43507.60842429954,
    volume_usd: 43507.60842429954,
  },
  {
    ticker_id: 'WBTC_USDC.e',
    base_currency: 'WBTC',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 62554.2,
    low: 60738.849,
    high: 62597.172,
    base_volume: 0.3576756816145009,
    target_volume: 22057.1476893977,
    volume_usd: 22057.1476893977,
  },
  {
    ticker_id: 'USDC_USDC.e',
    base_currency: 'USDC',
    target_currency: 'USDC.e',
    product_type: 'Spot',
    last_price: 1,
    low: 1,
    high: 1,
    base_volume: 123036.966535,
    target_volume: 123036.966535,
    volume_usd: 123036.966535,
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

  pairsData_arb.forEach((pair) => {
    const { ticker_id } = pair;

    const [baseCurrency, targetCurrency] = ticker_id.split('_');
    const exchange = 'ARBITRUM';
    const exchange_label = 'Arb';
    const label = `${baseCurrency} / ${targetCurrency} ${exchange_label}`;
    const value = `${baseCurrency}_${targetCurrency}_${exchange}`;
    const pricePairInput = { label, value };

    pricePairInputs.push(pricePairInput);
  });

  pairsData_ava.forEach((pair) => {
    const { ticker_id } = pair;

    const [baseCurrency, targetCurrency] = ticker_id.split('_');
    const exchange = 'AVALANCHE';
    const exchange_label = 'Ava';
    const label = `${baseCurrency} / ${targetCurrency} ${exchange_label}`;
    const value = `${baseCurrency}_${targetCurrency}_${exchange}`;
    const pricePairInput = { label, value };

    pricePairInputs.push(pricePairInput);
  });
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