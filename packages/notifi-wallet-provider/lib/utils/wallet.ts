import { Wallets } from '../types';

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
};
