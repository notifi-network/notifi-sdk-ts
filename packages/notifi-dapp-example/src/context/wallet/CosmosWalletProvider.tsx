'use client';

import { AssetList, Chain } from '@chain-registry/types';
import { wallets } from '@cosmos-kit/keplr';
import { ChainProvider } from '@cosmos-kit/react';
import { FC, PropsWithChildren } from 'react';

type KeplrWallet = (typeof wallets)[number];

// TODO: strong type instead of boolean (not sure where can get KeplrExtensionWallet type from)
const validateIsBrowserWallet = (wallet: KeplrWallet): boolean => {
  // NOTE: Only support extension wallet
  return !('WCClient' in wallet);
};

export const CosmosWalletProvider: FC<PropsWithChildren> = ({ children }) => {
  // NOTE: Customize modal theme (If needed)
  // const { modalTheme } = useModalTheme();
  // modalTheme;

  const keplrExtensionWallets = wallets.filter(validateIsBrowserWallet);

  return (
    <ChainProvider
      chains={[injChain]}
      assetLists={[assetList]}
      wallets={keplrExtensionWallets}
    >
      {children}
    </ChainProvider>
  );
};

const injChain: Chain = {
  chain_name: 'injective',
  status: 'live',
  network_type: 'mainnet',
  pretty_name: 'Injective',
  chain_id: 'injective-1',
  bech32_prefix: 'inj',
  bech32_config: {
    bech32PrefixAccAddr: 'inj',
    bech32PrefixAccPub: 'injpub',
    bech32PrefixValAddr: 'injvaloper',
    bech32PrefixValPub: 'injvaloperpub',
    bech32PrefixConsAddr: 'injvalcons',
    bech32PrefixConsPub: 'injvalconspub',
  },
  slip44: 60,
  fees: {
    fee_tokens: [
      {
        denom: 'inj',
        fixed_min_gas_price: 500000000,
        low_gas_price: 500000000,
        average_gas_price: 700000000,
        high_gas_price: 900000000,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: 'inj',
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: 'https://public.api.injective.network',
      },
    ],
    rest: [
      {
        address: 'https://public.lcd.injective.network',
      },
    ],
  },
  explorers: [
    {
      tx_page: 'https://explorer.injective.network/transaction/${txHash}',
    },
  ],
};

const assetList: AssetList = {
  chain_name: 'injective',
  // chain_id: 'injective-1',
  assets: [
    {
      description:
        'The INJ token is the native governance token for the Injective chain.',
      denom_units: [
        {
          denom:
            'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
          exponent: 0,
          aliases: ['inj'],
        },
        {
          denom: 'INJ',
          exponent: 18,
        },
      ],
      type_asset: 'ics20',
      base: 'ibc/64BA6E31FE887D66C6F8F31C7B1A80C7CA179239677B4088BB55F5EA07DBE273',
      name: 'Injective',
      display: 'INJ',
      symbol: 'INJ',
      traces: [
        {
          type: 'ibc',
          counterparty: {
            chain_name: 'injective',
            base_denom: 'inj',
            channel_id: 'channel-8',
          },
          chain: {
            channel_id: 'channel-122',
            path: 'transfer/channel-122/inj',
          },
        },
      ],
      logo_URIs: {
        png: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/injective/images/inj.png',
        svg: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/injective/images/inj.svg',
      },
      coingecko_id: 'injective-protocol',
      keywords: [
        'osmosis-main',
        'osmosis-info',
        'osmosis-price:ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4:1319',
      ],
      // origin_chain_id: 'injective-1',
      // origin_chain_name: 'injective',
      // relative_image_url: '/tokens/generated/inj.svg',
      // price_info: {
      //   dest_coin_minimal_denom:
      //     'ibc/498A0751C798A0D9A389AA3691123DADA57DAA4FE165D5C75894505B876BA6E4',
      //   pool_id: '1319',
      // },
    },
  ],
};
