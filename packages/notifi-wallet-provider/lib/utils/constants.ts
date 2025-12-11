import { Wallets } from '../types';

export const defaultValue = {
  cosmosChainPrefix: 'inj',
  cosmosChain: 'injective-1',
  walletConnectId: '632a105feb9cf8380428a4f240eb6f13',
  appName: 'Notifi',
};

export const walletsWebsiteLink: { [key in keyof Wallets]: string } = {
  metamask: 'https://metamask.io/download/',
  keplr: 'https://www.keplr.app/download',
  binance: 'https://www.bnbchain.org/en/binance-wallet',
  okx: 'https://www.okx.com/web3',
  rabby: 'https://rabby.io/',
  walletconnect: 'https://walletconnect.com/',
  coinbase: 'https://www.coinbase.com/wallet/downloads',
  rainbow: 'https://rainbow.me/en/',
  zerion: 'https://zerion.io/',
  xion: 'https://xion.burnt.com/',
  phantom: 'https://phantom.app/download',
  lace: 'https://lace.io/',
  eternl: 'https://eternl.io/',
  nufi: 'https://nu.fi/',
  'okx-cardano': 'https://www.okx.com/web3',
};
